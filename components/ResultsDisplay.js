

// 5. components/ResultsDisplay.js
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Copy, Check, Play } from 'lucide-react';

const ResultsDisplay = ({ results, type }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  if (!results) return null;
  
  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  
  const handleDownload = (data, filename) => {
    const blob = new Blob([typeof data === 'string' ? data : JSON.stringify(data, null, 2)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Display for a single video transcript
  if (type === 'video') {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {results.title || 'Video Transcript'}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(results.transcript, 'transcript')}
              >
                {copiedIndex === 'transcript' ? <Check size={16} /> : <Copy size={16} />}
                {copiedIndex === 'transcript' ? 'Copied' : 'Copy'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(results.transcript, `${results.title || 'transcript'}.${results.format}`)}
              >
                <Download size={16} className="mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] rounded-md border p-4">
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {results.transcript}
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }
  
  // Display for channel data
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Channel Info */}
      <Card>
        <CardHeader>
          <CardTitle>Channel Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold">{results.channelInfo.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{results.channelInfo.id}</p>
              <p className="text-sm mt-2 line-clamp-3">{results.channelInfo.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="border rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">{results.channelInfo.videoCount}</p>
                <p className="text-xs text-gray-500">Videos</p>
              </div>
              <div className="border rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">{results.channelInfo.subscriberCount}</p>
                <p className="text-xs text-gray-500">Subscribers</p>
              </div>
              <div className="border rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">{results.channelInfo.viewCount}</p>
                <p className="text-xs text-gray-500">Views</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Videos */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Videos</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(results.videos, 'videos.json')}
            >
              <Download size={16} className="mr-2" />
              Download All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.videos.slice(0, 10).map((video, index) => (
              <div key={video.id} className="border rounded-lg p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="shrink-0">
                    {video.thumbnailUrl ? (
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title} 
                        className="w-full md:w-40 h-auto rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-full md:w-40 h-24 bg-gray-200 rounded-md flex items-center justify-center">
                        <Play size={32} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-2">{video.title}</h3>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{video.viewCount} views</Badge>
                      <Badge variant="outline">{new Date(video.publishedAt).toLocaleDateString()}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{video.description}</p>
                    
                    {video.transcript && (
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(video.transcript, index)}
                        >
                          {copiedIndex === index ? <Check size={16} /> : <Copy size={16} />}
                          {copiedIndex === index ? 'Copied' : 'Copy Transcript'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {results.videos.length > 10 && (
              <div className="text-center py-2">
                <p className="text-sm text-gray-500">
                  Showing 10 of {results.videos.length} videos. Download the full list for more.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResultsDisplay;
