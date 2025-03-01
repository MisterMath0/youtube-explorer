//pages/api/transcript.js
import { getTranscript, getVideoIdFromUrl } from '../../lib/youtube-api';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { videoUrl, transcriptFormat } = req.body;

    // Validate input
    if (!videoUrl) {
      return res.status(400).json({ error: 'Missing video URL' });
    }
    
    // Extract video ID from URL
    const videoId = getVideoIdFromUrl(videoUrl);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }
    
    // Get the transcript
    const transcript = await getTranscript(videoId);
    if (!transcript) {
      return res.status(404).json({ error: 'No transcript available for this video' });
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
    
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: error.message || 'Failed to process request' });
  }
}