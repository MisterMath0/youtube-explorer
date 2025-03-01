
// 3. components/ChannelExtractor.js
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { extractChannelData } from '../lib/api';
import { AlertCircle, Youtube } from 'lucide-react';
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

const ChannelExtractor = ({ onResults, setLoading }) => {
  const [input, setInput] = useState('');
  const [inputType, setInputType] = useState('channel-id');
  const [apiKey, setApiKey] = useState('');
  const [withTranscripts, setWithTranscripts] = useState(false);
  const [maxVideos, setMaxVideos] = useState(10);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!input.trim()) {
      setError('Please enter a channel ID or username');
      return;
    }
    
    if (!apiKey.trim()) {
      setError('YouTube API key is required');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      // This would call your backend API
      const data = await extractChannelData({
        inputType,
        input,
        apiKey,
        withTranscripts,
        maxVideos,
      });
      
      onResults(data);
    } catch (err) {
      setError(err.message || 'Failed to extract channel data');
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
          <Label>YouTube API Key</Label>
          <Input
            type="password"
            placeholder="Enter your YouTube API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Get your API key from the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google Cloud Console</a>
          </p>
        </div>
        
        <div className="space-y-2">
          <Label>Channel Identification</Label>
          <RadioGroup value={inputType} onValueChange={setInputType} className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="channel-id" id="channel-id" />
              <Label htmlFor="channel-id">Channel ID</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="username" id="username" />
              <Label htmlFor="username">Username</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label>Enter {inputType === 'channel-id' ? 'Channel ID' : 'Username'}</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              <Youtube size={18} />
            </div>
            <Input
              className="pl-10"
              placeholder={inputType === 'channel-id' ? 'UC...' : 'Channel username'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Maximum videos to extract</Label>
          <Input
            type="number"
            min="1"
            max="500"
            value={maxVideos}
            onChange={(e) => setMaxVideos(Number(e.target.value))}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="transcripts" 
            checked={withTranscripts}
            onCheckedChange={setWithTranscripts}
          />
          <Label htmlFor="transcripts">Extract video transcripts (may take longer)</Label>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Button type="submit" className="w-full">
          Extract Channel Data
        </Button>
      </form>
    </motion.div>
  );
};

export default ChannelExtractor;
