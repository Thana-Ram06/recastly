import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/firebase/admin';
import { getUser, createOrUpdateUser, hasExceededLimit, incrementUsage, saveGeneration } from '@/lib/firestore';
import { generateAllContent } from '@/lib/claude';
import { YoutubeTranscript } from 'youtube-transcript';
import { extractVideoId } from '@/utils/helpers';

async function fetchVideoTitle(videoId: string): Promise<string> {
  try {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return '';
    const data = await res.json();
    return typeof data.title === 'string' ? data.title : '';
  } catch {
    return '';
  }
}

export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;
    console.log(`[generate] uid=${uid}`);

    // ── User + limits ─────────────────────────────────────────────────────────
    let user = await getUser(uid);
    if (!user) {
      // Create user on first use if the session API hasn't run yet
      await createOrUpdateUser({
        uid,
        email: decoded.email || '',
        displayName: decoded.name || '',
        photoURL: decoded.picture || null,
      });
      user = await getUser(uid);
    }

    const exceeded = await hasExceededLimit(uid, user!.plan);
    if (exceeded) {
      return NextResponse.json(
        { error: 'Monthly generation limit reached. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    // ── Parse request ─────────────────────────────────────────────────────────
    const body = await req.json().catch(() => ({}));
    const { youtubeUrl } = body;
    if (!youtubeUrl) return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }
    console.log(`[generate] videoId=${videoId}`);

    // ── Transcript ────────────────────────────────────────────────────────────
    let transcript: string;
    try {
      console.log(`[generate] fetching transcript…`);
      const items = await YoutubeTranscript.fetchTranscript(videoId);
      transcript = items.map((i) => i.text).join(' ').trim();
      console.log(`[generate] transcript length=${transcript.length}`);

      if (!transcript || transcript.length < 50) {
        return NextResponse.json(
          { error: 'This video has no usable captions. Please try a video with subtitles enabled.' },
          { status: 422 }
        );
      }
    } catch (err) {
      console.error('[generate] transcript error:', err);
      return NextResponse.json(
        { error: 'Could not extract transcript. This video may have captions disabled or restricted.' },
        { status: 422 }
      );
    }

    // ── Fetch title + generate content (parallel) ─────────────────────────────
    console.log(`[generate] starting AI generation…`);
    const [videoTitle, { linkedinPosts, twitterThreads, newsletter, instagramCaptions }] =
      await Promise.all([
        fetchVideoTitle(videoId),
        generateAllContent(transcript),
      ]);

    console.log(`[generate] AI done in ${Date.now() - start}ms — title="${videoTitle}"`);
    console.log(`[generate] linkedin=${linkedinPosts.length} twitter=${twitterThreads.length} instagram=${instagramCaptions.length}`);

    // ── Save ──────────────────────────────────────────────────────────────────
    await incrementUsage(uid);

    const newsletterText = newsletter.subject
      ? `Subject: ${newsletter.subject}\n\n${newsletter.content}`
      : newsletter.content;

    const generationData: Omit<import('@/types').Generation, 'id'> = {
      uid,
      youtubeUrl,
      ...(videoTitle ? { videoTitle } : {}),
      linkedinPosts,
      twitterThreads,
      newsletter: newsletterText,
      instagramCaptions,
      createdAt: Date.now(),
    };

    const generationId = await saveGeneration(generationData);
    console.log(`[generate] saved id=${generationId} total_time=${Date.now() - start}ms`);

    return NextResponse.json({
      generation: { id: generationId, ...generationData },
    });
  } catch (err: unknown) {
    console.error('[generate] unhandled error:', err);
    let message = 'Something went wrong. Please try again.';
    if (err instanceof Error) {
      message = err.message;
      // Safety net: never surface raw gRPC codes (e.g. "5 NOT_FOUND") to the UI.
      // mapGeminiError in lib/claude.ts should already handle these, but
      // if something slips through, replace it with something readable.
      if (/^\d+ [A-Z_]+/.test(message)) {
        message = `AI generation failed (${message}). Check your GOOGLE_AI_API_KEY and GEMINI_MODEL env vars.`;
      }
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
