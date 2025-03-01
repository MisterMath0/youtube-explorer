
// 4. components/VideoTranscript.js
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { extractVideoTranscript } from '../lib/api';
import { AlertCircle, Link2 } from 'lucide-react';
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

const VideoTranscript = ({ onResults, setLoading }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [transcriptFormat, setTranscriptFormat] = useState('txt');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!videoUrl.trim()) {
      setError('Please enter a YouTube video URL');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      // This would call your backend API
      const data = await extractVideoTranscript({
        videoUrl,
        transcriptFormat,
      });
      
      onResults(data);
    } catch (err) {
      setError(err.message || 'Failed to extract video transcript');
      setLoading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label>YouTube Video URL</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              <Link2 size={18} />
            </div>
            <Input
              className="pl-10"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Transcript Format</Label>
          <RadioGroup value={transcriptFormat} onValueChange={setTranscriptFormat} className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="txt" id="txt" />
              <Label htmlFor="txt">TXT (with timestamps)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="json" id="json" />
              <Label htmlFor="json">JSON</Label>
            </div>
          </RadioGroup>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Button type="submit" className="w-full">
          Extract Transcript
        </Button>
      </form>
    </motion.div>
  );
};

export default VideoTranscript;