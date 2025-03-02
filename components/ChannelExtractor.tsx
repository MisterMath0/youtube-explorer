'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Youtube } from 'lucide-react';
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { ChannelApiParams, ExtractorProps } from '@/types';

const ChannelExtractor: React.FC<ExtractorProps> = ({ onResults, setLoading, apiKey: externalApiKey }) => {
  const [input, setInput] = useState<string>('');
  const [inputType, setInputType] = useState<'channel-id' | 'username'>('channel-id');
  const [apiKey, setApiKey] = useState<string>('');
  const [withTranscripts, setWithTranscripts] = useState<boolean>(false);
  const [maxVideos, setMaxVideos] = useState<number>(10);
  const [error, setError] = useState<string | null>(null);

  // Use external API key if provided
  useEffect(() => {
    if (externalApiKey) {
      setApiKey(externalApiKey);
    }
  }, [externalApiKey]);

  const handleSubmit = async (e: React.FormEvent) => {
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
      const response = await fetch('/api/channel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputType,
          input,
          apiKey,
          withTranscripts,
          maxVideos,
        } as ChannelApiParams),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extract channel data');
      }
      
      const data = await response.json();
      onResults(data);
    } catch (err: any) {
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
        {!externalApiKey && (
          <div className="space-y-3">
            <Label htmlFor="api-key" className="text-base font-medium">YouTube API Key</Label>
            <Input
              id="api-key"
              type="password"
              className="h-12 text-base"
              placeholder="Enter your YouTube API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Get your API key from the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google Cloud Console</a>
            </p>
          </div>
        )}
        
        <div className="space-y-3">
          <Label className="text-base font-medium">Channel Identification Method</Label>
          <RadioGroup 
            value={inputType} 
            onValueChange={(value: string) => setInputType(value as 'channel-id' | 'username')} 
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 rounded-md border p-4">
              <RadioGroupItem value="channel-id" id="channel-id" />
              <div>
                <Label htmlFor="channel-id" className="text-base font-medium cursor-pointer">Channel ID</Label>
                <p className="text-sm text-gray-500">Use the channel's unique identifier (e.g. UC...)</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 rounded-md border p-4">
              <RadioGroupItem value="username" id="username" />
              <div>
                <Label htmlFor="username" className="text-base font-medium cursor-pointer">Username</Label>
                <p className="text-sm text-gray-500">Use the channel's custom username</p>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="channel-input" className="text-base font-medium">
            Enter {inputType === 'channel-id' ? 'Channel ID' : 'Username'}
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              <Youtube size={18} />
            </div>
            <Input
              id="channel-input"
              className="pl-10 h-12 text-base"
              placeholder={inputType === 'channel-id' ? 'UC...' : 'Channel username'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <p className="text-xs text-gray-500">
            {inputType === 'channel-id' 
              ? "Channel ID starts with 'UC' and can be found in the channel's URL" 
              : "Username is the custom name used in the channel's URL"}
          </p>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="max-videos" className="text-base font-medium">Maximum Videos to Extract</Label>
          <Input
            id="max-videos"
            type="number"
            min="1"
            max="500"
            className="h-12 text-base"
            value={maxVideos}
            onChange={(e) => setMaxVideos(Number(e.target.value))}
          />
          <p className="text-xs text-gray-500">
            Higher values will take longer to process (max 500)
          </p>
        </div>
        
        <div className="flex items-start space-x-3 pt-2">
          <Checkbox 
            id="transcripts" 
            checked={withTranscripts}
            onCheckedChange={(checked: boolean) => setWithTranscripts(checked === true)}
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="transcripts" className="text-base font-medium cursor-pointer">
              Extract Video Transcripts
            </Label>
            <p className="text-xs text-gray-500">
              This will significantly increase processing time
            </p>
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Button 
          type="submit" 
          className="w-full h-12 text-base font-medium focus:ring-2 focus:ring-black dark:focus:ring-gray-300 hover:ring-2 hover:ring-black dark:hover:ring-black"
        >
          Extract Channel Data
        </Button>
      </form>
    </motion.div>
  );
};

export default ChannelExtractor;