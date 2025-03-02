// types.ts
export interface ChannelInfo {
    id: string;
    title: string;
    description: string;
    customUrl?: string;
    publishedAt: string;
    thumbnailUrl?: string;
    country?: string;
    viewCount: string;
    subscriberCount: string;
    videoCount: string;
  }
  
  export interface VideoInfo {
    videoId: string;
    title: string;
    description: string;
    publishedAt: string;
    thumbnailUrl?: string;
    viewCount: string;
    likeCount?: string;
    commentCount?: string;
    duration?: string;
    transcript?: string | Record<string, any>;
  }
  
  export interface ChannelData {
    channelInfo: ChannelInfo;
    videos: VideoInfo[];
  }
  
  export interface VideoTranscriptData {
    videoId: string;
    title?: string;
    transcript: string | Record<string, any>;
    format: string;
  }
  
  export interface ResultsDisplayProps {
    results: ChannelData | VideoTranscriptData;
    type: string;
  }
  
  export interface ExtractorProps {
    onResults: (data: ChannelData | VideoTranscriptData) => void;
    setLoading: (loading: boolean) => void;
    apiKey?: string;
  }
  
  export interface ChannelApiParams {
    // Original params
    inputType?: 'channel-id' | 'username';
    input?: string;
    withTranscripts?: boolean;
    
    // New params
    channelUrl?: string;
    includeTranscripts?: boolean;
    maxVideos: number;
    apiKey?: string;
  }
  
  export interface VideoApiParams {
    videoUrl: string;
    transcriptFormat: string;
    apiKey?: string;
  }