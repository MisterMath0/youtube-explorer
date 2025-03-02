// lib/youtube-api.ts
import axios from 'axios';
import type { VideoInfo } from '@/types';

// Function to extract YouTube Channel data
export async function getChannelInfo(apiKey: string, channelId: string | null = null, username: string | null = null) {
  const params: Record<string, string> = {
    part: 'snippet,statistics,contentDetails',
    key: apiKey
  };

  if (channelId) {
    params.id = channelId;
  } else if (username) {
    params.forUsername = username;
  } else {
    throw new Error('Either channelId or username must be provided');
  }

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', { params });
    
    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('Channel not found');
    }
    
    return response.data.items[0];
  } catch (error) {
    console.error('Error fetching channel:', error);
    throw error;
  }
}

// Function to get channel videos
export async function getChannelVideos(apiKey: string, channelId: string, maxResults = 50) {
  try {
    // First, get the uploads playlist ID
    const channelInfo = await getChannelInfo(apiKey, channelId);
    const uploadsPlaylistId = channelInfo.contentDetails.relatedPlaylists.uploads;
    
    let videos: string | any[] = [];
    let nextPageToken = null;
    
    // Fetch videos until we have enough or there are no more pages
    while (true) {
      const params: Record<string, string | number | undefined> = {
        part: 'snippet,contentDetails',
        maxResults: 50, // API maximum
        playlistId: uploadsPlaylistId,
        key: apiKey,
        pageToken: nextPageToken || undefined
      };
      
      const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', { params });
      videos = [...videos, ...response.data.items];
      
      nextPageToken = response.data.nextPageToken;
      
      if (!nextPageToken || videos.length >= maxResults) {
        break;
      }
    }
    
    // Truncate to maxResults
    return videos.slice(0, maxResults);
    
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
}

// Function to get video details
export async function getVideoDetails(apiKey: string, videoIds: string[]) {
  try {
    // YouTube API allows only 50 video IDs per request
    const chunks = [];
    for (let i = 0; i < videoIds.length; i += 50) {
      chunks.push(videoIds.slice(i, i + 50));
    }
    
    let allVideos: any[] = [];
    
    for (const chunk of chunks) {
      const params = {
        part: 'snippet,contentDetails,statistics',
        id: chunk.join(','),
        key: apiKey
      };
      
      const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', { params });
      allVideos = [...allVideos, ...response.data.items];
    }
    
    return allVideos;
    
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
}

// Function to get transcript (this requires a different approach since it's scraping)
export async function getTranscript(videoId: string) {
  try {
    // First get the video page
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await axios.get(videoUrl);
    
    // Extract the transcript URL using regex
    const html = response.data;
    const captionTrackRegex = /"captionTracks":\[\{"baseUrl":"([^"]+)"/;
    const match = html.match(captionTrackRegex);
    
    if (!match) {
      return null; // No transcript available
    }
    
    // Get the transcript data
    const transcriptUrl = match[1].replace(/\\u0026/g, '&');
    const transcriptResponse = await axios.get(transcriptUrl);
    const transcriptXml = transcriptResponse.data;
    
    // Parse the XML transcript
    const textRegex = /<text start="([^"]+)" dur="([^"]+)">([^<]+)<\/text>/g;
    let transcriptLines = [];
    let m;
    
    while ((m = textRegex.exec(transcriptXml)) !== null) {
      const startSeconds = parseFloat(m[1]);
      const hours = Math.floor(startSeconds / 3600);
      const minutes = Math.floor((startSeconds % 3600) / 60);
      const seconds = Math.floor(startSeconds % 60);
      const formattedTime = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
      // Decode HTML entities
      const text = m[3].replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&quot;/g, '"')
                        .replace(/&#39;/g, "'");
      
      transcriptLines.push({
        time: formattedTime,
        text: text
      });
    }
    
    return transcriptLines;
    
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return null;
  }
}

// Utility function to get video ID from URL
export function getVideoIdFromUrl(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

// Format video information
export function formatVideoInfo(video: any): VideoInfo {
  const snippet = video.snippet;
  const statistics = video.statistics || {};
  
  return {
    videoId: video.id,
    title: snippet.title,
    description: snippet.description,
    publishedAt: snippet.publishedAt,
    thumbnailUrl: snippet.thumbnails.high?.url || snippet.thumbnails.default?.url,
    viewCount: statistics.viewCount || 'N/A',
    likeCount: statistics.likeCount || 'N/A',
    commentCount: statistics.commentCount || 'N/A'
  };
}