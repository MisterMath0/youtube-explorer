# YouTube Explorer

<p align="center">
  <img src="public/logo.png" alt="YouTube Explorer Logo" width="200"/>
</p>

YouTube Explorer is a powerful tool for extracting and analyzing YouTube channel information, videos, and transcripts. It features a modern, user-friendly interface built with Next.js and a robust backend that utilizes the YouTube Data API.

## ✨ Features

- **Channel Analytics**: Extract comprehensive channel information including subscriber count, video count, and total views
- **Video Extraction**: Retrieve all videos from a channel with metadata (views, likes, comments)
- **Transcript Extraction**: Get transcripts with timestamps from any YouTube video
- **Modern UI**: Clean, responsive interface with dark mode support
- **Data Export**: Download data in various formats (JSON, CSV, TXT)

## 🚀 Live Demo

Check out the live demo: [YouTube Explorer App](https://youtube-explorer.vercel.app)

## 🛠️ Installation

### Prerequisites

- Node.js (v14 or higher)
- YouTube Data API key ([Get one here](https://console.cloud.google.com/))

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/youtube-explorer.git
cd youtube-explorer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the project root:
```
NEXT_PUBLIC_DEFAULT_API_KEY=your_youtube_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Usage

### Channel Exploration

1. Enter your YouTube API key (or use the default if configured)
2. Choose whether to search by Channel ID or Username
3. Enter the Channel ID or Username
4. Set the maximum number of videos to extract
5. Toggle transcript extraction if needed
6. Click "Extract Channel Data"

### Single Video Transcript

1. Enter the YouTube video URL
2. Choose your preferred transcript format (TXT or JSON)
3. Click "Extract Transcript"

## 📋 API Documentation

The application provides two main API endpoints:

### `POST /api/channel`

Extracts channel information and videos.

**Request body:**
```json
{
  "inputType": "channel-id", // or "username"
  "input": "UC_x5XG1OV2P6uZZ5FSM9Ttw", // Channel ID or username
  "apiKey": "YOUR_API_KEY",
  "withTranscripts": true, // Whether to extract transcripts
  "maxVideos": 10 // Maximum number of videos to extract
}
```

### `POST /api/transcript`

Extracts transcript from a single video.

**Request body:**
```json
{
  "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
  "transcriptFormat": "txt" // or "json"
}
```

## 🔧 Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Next.js API Routes, YouTube Data API
- **Deployment**: Vercel

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

For any questions or feedback, please create an issue in the repository or contact the maintainer directly.

## ⚠️ Disclaimer

This tool uses the YouTube Data API and scraping techniques for transcript extraction. Please respect YouTube's Terms of Service and API quotas. The developers of this tool are not responsible for any misuse or violation of YouTube's Terms of Service. 