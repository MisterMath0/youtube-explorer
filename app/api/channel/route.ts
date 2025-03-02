import { NextResponse } from 'next/server';
import { 
  getChannelInfo, 
  getChannelVideos, 
  getVideoDetails, 
  getTranscript, 
  formatVideoInfo 
} from '@/lib/youtube-api';

export async function POST(request: Request) {
  try {
    const { inputType, input, apiKey, withTranscripts, maxVideos } = await request.json();

    // Validate inputs
    if (!input || !apiKey) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Get channel info
    const channelId = inputType === 'channel-id' ? input : null;
    const username = inputType === 'username' ? input : null;
    
    const channelInfo = await getChannelInfo(apiKey, channelId, username);
    const actualChannelId = channelInfo.id;
    
    // Get videos from the channel
    const videos = await getChannelVideos(apiKey, actualChannelId, maxVideos);
    const videoIds = videos.map(video => video.contentDetails.videoId);
    
    // Get detailed video information
    const videoDetails = await getVideoDetails(apiKey, videoIds);
    let formattedVideos = videoDetails.map(formatVideoInfo);
    
    // Get transcripts if requested
    if (withTranscripts) {
      for (let i = 0; i < formattedVideos.length; i++) {
        const video = formattedVideos[i];
        const transcript = await getTranscript(video.videoId);
        if (transcript) {
          formattedVideos[i].transcript = transcript;
        }
      }
    }
    
    // Format the response
    const response = {
      channelInfo: {
        id: channelInfo.id,
        title: channelInfo.snippet.title,
        description: channelInfo.snippet.description,
        publishedAt: channelInfo.snippet.publishedAt,
        subscriberCount: channelInfo.statistics.subscriberCount,
        videoCount: channelInfo.statistics.videoCount,
        viewCount: channelInfo.statistics.viewCount
      },
      videos: formattedVideos
    };
    
    return NextResponse.json(response);
    
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  }
}