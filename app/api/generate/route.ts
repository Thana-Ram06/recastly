import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/firebase/admin';
import { getUser, hasExceededLimit, incrementUsage, saveGeneration } from '@/lib/firestore';
import { generateAllContent } from '@/lib/claude';
import { YoutubeTranscript } from 'youtube-transcript';
import { extractVideoId } from '@/utils/helpers';

export async function POST(req: NextRequest) {
  try {
    // Auth
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    // Fetch user & check limits
    const user = await getUser(uid);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const exceeded = await hasExceededLimit(uid, user.plan);
    if (exceeded) {
      return NextResponse.json(
        { error: 'Monthly generation limit reached. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    // Parse request
    const { youtubeUrl } = await req.json();
    if (!youtubeUrl) return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    // Extract transcript
    let transcript: string;

    try {
      const items = await YoutubeTranscript.fetchTranscript(videoId);
      transcript = items.map((i) => i.text).join(' ');

      if (!transcript || transcript.length < 50) {
        return NextResponse.json(
          { error: 'This video has no captions. Please try a video with subtitles.' },
          { status: 422 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'Could not extract transcript. This video may have captions disabled.' },
        { status: 422 }
      );
    }

    // Generate content via Claude (all platforms in parallel)
    const { linkedinPosts, twitterThreads, newsletter, instagramCaptions } =
      await generateAllContent(transcript);

    // Increment usage
    await incrementUsage(uid);

    // Build newsletter string
    const newsletterText = newsletter.subject
      ? `Subject: ${newsletter.subject}\n\n${newsletter.content}`
      : newsletter.content;

    // Save to Firestore
    const generationData = {
      uid,
      youtubeUrl,
      linkedinPosts,
      twitterThreads,
      newsletter: newsletterText,
      instagramCaptions,
      createdAt: Date.now(),
    };

    const generationId = await saveGeneration(generationData);

    return NextResponse.json({
      generation: {
        id: generationId,
        ...generationData,
      },
    });
  } catch (err: unknown) {
    console.error('[generate]', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
