import { NextResponse } from 'next/server';
import { getTranscript, getVideoIdFromUrl } from '@/lib/youtube-api';

export async function POST(request: Request) {
  try {
    const { videoUrl, transcriptFormat } = await request.json();

    // Validate input
    if (!videoUrl) {
      return NextResponse.json({ error: 'Missing video URL' }, { status: 400 });
    }
    
    // Extract video ID from URL
    const videoId = getVideoIdFromUrl(videoUrl);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }
    
    // Get the transcript
    const transcript = await getTranscript(videoId);
    if (!transcript) {
      return NextResponse.json({ error: 'No transcript available for this video' }, { status: 404 });
    }
    
    // Format the transcript according to the requested format
    let formattedTranscript;
    if (transcriptFormat === 'txt') {
      formattedTranscript = transcript.map(line => `[${line.time}] ${line.text}`).join('\n');
    } else {
      formattedTranscript = transcript;
    }
    
    // Use the video ID as the title (we don't have the title without an API key)
    const response = {
      title: `video_${videoId}`,
      format: transcriptFormat,
      transcript: formattedTranscript
    };
    
    return NextResponse.json(response);
    
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  }
}