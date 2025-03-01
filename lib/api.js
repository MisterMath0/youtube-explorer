
// 6. lib/api.js
// This would connect to your backend Python script
// For now, we'll mock the responses

// Mock data for testing the UI
const MOCK_CHANNEL_DATA = {
    channelInfo: {
      id: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
      title: 'Google Developers',
      description: 'The Google Developers channel features talks from events, educational series, best practices, tips, and the latest updates across our products and platforms.',
      subscriberCount: '2.3M',
      videoCount: '5,234',
      viewCount: '156M'
    },
    videos: [
      {
        id: 'video1',
        title: 'Building a Next.js App with YouTube API',
        description: 'Learn how to build a modern web application using Next.js and the YouTube API.',
        publishedAt: '2023-01-15T14:00:00Z',
        thumbnailUrl: 'https://via.placeholder.com/480x360',
        viewCount: '25,431',
        likeCount: '1,200',
        commentCount: '145',
        transcript: '[00:00:01] Hello and welcome to this tutorial.\n[00:00:05] Today we\'ll be building a YouTube data extraction tool.'
      },
      {
        id: 'video2',
        title: 'Modern React Patterns for 2023',
        description: 'Discover the latest patterns and practices for React development in 2023.',
        publishedAt: '2023-02-22T15:30:00Z',
        thumbnailUrl: 'https://via.placeholder.com/480x360',
        viewCount: '42,651',
        likeCount: '3,100',
        commentCount: '278',
        transcript: '[00:00:01] React has evolved significantly over the years.\n[00:00:07] Let\'s explore the modern patterns.'
      },
      // More mock videos...
    ]
  };
  
  const MOCK_TRANSCRIPT = {
    title: 'How to Build a YouTube Extractor',
    format: 'txt',
    transcript: '[00:00:01] Hello and welcome to this tutorial.\n[00:00:05] Today we\'ll be building a YouTube data extraction tool.\n[00:00:10] Let\'s start by setting up our environment.\n[00:00:15] We\'ll need Python and several libraries.\n[00:00:20] First, install the requests library.\n[00:00:25] Next, we\'ll need to get a YouTube API key.\n[00:00:30] Go to the Google Cloud Console to set this up.\n[00:00:35] Now let\'s write the code to extract channel information.\n[00:00:40] We\'ll use the channels endpoint of the YouTube API.\n[00:00:45] This will give us basic channel details.\n[00:00:50] Next, we\'ll get the video list.\n[00:00:55] Finally, we\'ll extract transcripts from each video.'
  };
  
  export const extractChannelData = async ({ inputType, input, apiKey, withTranscripts, maxVideos }) => {
    console.log('Extracting channel data with:', { inputType, input, apiKey, withTranscripts, maxVideos });
    
    // In a real app, this would call your backend API
    // For now, we'll just simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate random error for testing
    if (Math.random() < 0.1) {
      throw new Error('Failed to extract channel data. Please check your API key and try again.');
    }
    
    return MOCK_CHANNEL_DATA;
  };
  
  export const extractVideoTranscript = async ({ videoUrl, transcriptFormat }) => {
    console.log('Extracting video transcript with:', { videoUrl, transcriptFormat });
    
    // In a real app, this would call your backend API
    // For now, we'll just simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate random error for testing
    if (Math.random() < 0.1) {
      throw new Error('Failed to extract transcript. This video may not have captions available.');
    }
    
    return MOCK_TRANSCRIPT;
  };
  