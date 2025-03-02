// lib/api.ts
import type { ChannelApiParams, VideoApiParams, ChannelData, VideoTranscriptData } from '@/types';
import { 
  getChannelInfo, 
  getChannelVideos, 
  getVideoDetails, 
  getTranscript, 
  getVideoIdFromUrl,
  formatVideoInfo 
} from '@/lib/youtube-api';

export const extractChannelData = async (
  params: ChannelApiParams
): Promise<ChannelData> => {
  const { inputType, input, apiKey, withTranscripts, maxVideos } = params;
  
  // Validate inputs
  if (!input || !apiKey) {
    throw new Error('Missing required parameters');
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
  return {
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
};

export const extractVideoTranscript = async (
  params: VideoApiParams
): Promise<VideoTranscriptData> => {
  const { videoUrl, transcriptFormat } = params;

  // Validate input
  if (!videoUrl) {
    throw new Error('Missing video URL');
  }
  
  // Extract video ID from URL
  const videoId = getVideoIdFromUrl(videoUrl);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }
  
  // Get the transcript
  const transcript = await getTranscript(videoId);
  if (!transcript) {
    throw new Error('No transcript available for this video');
  }
  
  // Format the transcript according to the requested format
  let formattedTranscript;
  if (transcriptFormat === 'txt') {
    formattedTranscript = transcript.map(line => `[${line.time}] ${line.text}`).join('\n');
  } else {
    formattedTranscript = transcript;
  }
  
  // Use the video ID as the title (we don't have the title without an API key)
  return {
    videoId: videoId,
    title: `video_${videoId}`,
    format: transcriptFormat,
    transcript: formattedTranscript
  };
};