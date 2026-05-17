import { NextRequest, NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import { adminAuth } from '@/firebase/admin';
import { extractVideoId } from '@/utils/helpers';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await adminAuth.verifyIdToken(token);

    const { youtubeUrl } = await req.json();
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    const transcript = transcriptItems.map((item) => item.text).join(' ');

    if (!transcript || transcript.length < 100) {
      return NextResponse.json(
        { error: 'Could not extract transcript. The video may not have captions.' },
        { status: 422 }
      );
    }

    return NextResponse.json({ transcript, videoId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch transcript';
    const isTranscriptError =
      message.toLowerCase().includes('transcript') ||
      message.toLowerCase().includes('disabled') ||
      message.toLowerCase().includes('unavailable');

    return NextResponse.json(
      {
        error: isTranscriptError
          ? 'This video does not have captions available. Please try a different video.'
          : 'Failed to extract transcript. Please try again.',
      },
      { status: 422 }
    );
  }
}
