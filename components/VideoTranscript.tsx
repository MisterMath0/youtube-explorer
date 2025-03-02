'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertCircle, Link2 } from 'lucide-react';
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { ExtractorProps, VideoApiParams } from '@/types';

const VideoTranscript: React.FC<ExtractorProps> = ({ onResults, setLoading, apiKey }) => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [transcriptFormat, setTranscriptFormat] = useState<string>('txt');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!videoUrl.trim()) {
      setError('Please enter a YouTube video URL');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoUrl,
          transcriptFormat,
          apiKey,
        } as VideoApiParams),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract video transcript');
      }
      
      const data = await response.json();
      onResults(data);
    } catch (err: any) {
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
        <div className="space-y-3">
          <Label htmlFor="video-url" className="text-base font-medium">YouTube Video URL</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              <Link2 size={18} />
            </div>
            <Input
              id="video-url"
              className="pl-10 h-12 text-base"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>
          <p className="text-xs text-gray-500">
            Enter a YouTube video URL or video ID
          </p>
        </div>
        
        <div className="space-y-3">
          <Label className="text-base font-medium">Transcript Format</Label>
          <RadioGroup value={transcriptFormat} onValueChange={setTranscriptFormat} className="flex flex-col space-y-3">
            <div className="flex items-center space-x-3 rounded-md border p-4">
              <RadioGroupItem value="txt" id="txt" />
              <div>
                <Label htmlFor="txt" className="text-base font-medium cursor-pointer">TXT Format</Label>
                <p className="text-sm text-gray-500">Plain text with timestamps (easier to read)</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 rounded-md border p-4">
              <RadioGroupItem value="json" id="json" />
              <div>
                <Label htmlFor="json" className="text-base font-medium cursor-pointer">JSON Format</Label>
                <p className="text-sm text-gray-500">Structured data format (better for processing)</p>
              </div>
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
        
        <Button type="submit" className="w-full h-12 text-base font-medium">
          Extract Transcript
        </Button>
      </form>
    </motion.div>
  );
};

export default VideoTranscript;