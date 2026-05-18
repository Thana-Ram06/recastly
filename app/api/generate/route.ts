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

function isFirebaseError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const m = err.message;
  // Firebase Admin SDK gRPC errors: "5 NOT_FOUND", "7 PERMISSION_DENIED", "16 UNAUTHENTICATED"
  return /^\d+ [A-Z_]+/.test(m) || m.includes('FIREBASE') || m.includes('credential') || m.includes('serviceAccount');
}

export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let uid: string;
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      uid = decoded.uid;
    } catch (err) {
      console.error('[generate] auth error:', err instanceof Error ? err.message : err);
      if (isFirebaseError(err)) {
        return NextResponse.json(
          { error: 'Firebase Admin SDK is not configured. Ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in your environment variables.' },
          { status: 500 }
        );
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log(`[generate] uid=${uid}`);

    // ── User + limits ─────────────────────────────────────────────────────────
    let user;
    try {
      user = await getUser(uid);
      if (!user) {
        const decoded = await adminAuth.verifyIdToken(token);
        await createOrUpdateUser({
          uid,
          email: decoded.email || '',
          displayName: decoded.name || '',
          photoURL: decoded.picture || null,
        });
        user = await getUser(uid);
      }
    } catch (err) {
      console.error('[generate] firestore user error:', err instanceof Error ? err.message : err);
      return NextResponse.json(
        { error: 'Could not load your account. Ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set as environment variables.' },
        { status: 500 }
      );
    }

    try {
      const exceeded = await hasExceededLimit(uid, user!.plan);
      if (exceeded) {
        return NextResponse.json(
          { error: 'Monthly generation limit reached. Please upgrade your plan.' },
          { status: 403 }
        );
      }
    } catch (err) {
      console.error('[generate] limit check error:', err instanceof Error ? err.message : err);
      // Non-fatal — continue if limit check fails
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
      // Firebase Admin gRPC codes that slipped through (e.g. "5 NOT_FOUND: ")
      if (/^\d+ [A-Z_]+/.test(message)) {
        message =
          'Firebase Admin is not configured correctly. ' +
          'Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your environment variables.';
      }
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
