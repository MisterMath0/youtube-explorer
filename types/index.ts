export interface TranscriptLine {
    time: string;
    text: string;
  }
  
  export interface ChannelInfo {
    id: string;
    title: string;
    description: string;
    publishedAt: string;
    subscriberCount: string;
    videoCount: string;
    viewCount: string;
  }
  
  export interface VideoInfo {
    videoId: string;
    title: string;
    description: string;
    publishedAt: string;
    thumbnailUrl: string;
    viewCount: string;
    likeCount: string;
    commentCount: string;
    transcript?: TranscriptLine[];
  }
  
  export interface ChannelData {
    channelInfo: ChannelInfo;
    videos: VideoInfo[];
  }
  
  export interface VideoTranscriptData {
    title: string;
    format: string;
    transcript: string | TranscriptLine[];
  }
  
  export interface VideoApiParams {
    videoUrl: string;
    transcriptFormat: string;
  }
  
  export interface ChannelApiParams {
    inputType: 'channel-id' | 'username';
    input: string;
    apiKey: string;
    withTranscripts: boolean;
    maxVideos: number;
  }
  
  export interface ExtractorProps {
    onResults: (data: ChannelData | VideoTranscriptData) => void;
    setLoading: (loading: boolean) => void;
  }
  
  export interface ResultsDisplayProps {
    results: ChannelData | VideoTranscriptData;
    type: string;
  }