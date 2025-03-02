'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Layout from '@/components/Layout';
import ChannelExtractor from '@/components/ChannelExtractor';
import VideoTranscript from '@/components/VideoTranscript';
import ResultsDisplay from '@/components/ResultsDisplay';
import { ChannelData, VideoTranscriptData } from '@/types';
import { Save, Key } from 'lucide-react';
import { Compass, Video } from "lucide-react";


export default function Home() {
    const [results, setResults] = useState<ChannelData | VideoTranscriptData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>('channel');
    const [apiKey, setApiKey] = useState<string>('');
    const [saveApiKey, setSaveApiKey] = useState<boolean>(false);
    const [apiKeyVisible, setApiKeyVisible] = useState<boolean>(false);

    // Load API key from localStorage on component mount
    useEffect(() => {
        const savedApiKey = localStorage.getItem('youtube_explorer_api_key');
        if (savedApiKey) {
            setApiKey(savedApiKey);
            setSaveApiKey(true);
        }
    }, []);

    const handleApiKeySave = () => {
        if (saveApiKey && apiKey) {
            localStorage.setItem('youtube_explorer_api_key', apiKey);
        } else {
            localStorage.removeItem('youtube_explorer_api_key');
        }
    };

    const handleResults = (data: ChannelData | VideoTranscriptData) => {
        setResults(data);
        setLoading(false);
    };

    return (
        <Layout>
            <div className="container max-w-4xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-3">
                        YouTube Explorer
                    </h1>
                    <p className="text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                        Extract channel information, videos, and transcripts with ease
                    </p>
                </div>

                {/* API Key Section */}
                <Card className="mb-8 border border-gray-200 dark:border-gray-800">
                    <CardContent className="pt-6 pb-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="api-key" className="text-base font-medium">YouTube API Key</Label>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setApiKeyVisible(!apiKeyVisible)}
                                    className="h-8 px-2"
                                >
                                    {apiKeyVisible ? 'Hide' : 'Show'}
                                </Button>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                                    <Key size={18} />
                                </div>
                                <Input
                                    id="api-key"
                                    className="pl-10 h-12 text-base"
                                    type={apiKeyVisible ? "text" : "password"}
                                    placeholder="Enter your YouTube Data API key"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="save-api-key"
                                        checked={saveApiKey}
                                        onCheckedChange={setSaveApiKey}
                                    />
                                    <Label htmlFor="save-api-key" className="text-sm cursor-pointer">Save API key in browser</Label>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleApiKeySave}
                                    className="flex items-center"
                                >
                                    <Save size={16} className="mr-2" />
                                    Save Settings
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-10 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <CardContent className="p-6">
                    <Tabs defaultValue="channel" value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <TabsTrigger 
                            value="channel" 
                            className="rounded-md py-0 px-4 text-base font-medium transition-all duration-200 ease-in-out
                            data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 
                            data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400
                            data-[state=active]:shadow-sm data-[state=active]:font-semibold
                            hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
                            >
                            <Compass className="w-5 h-5 mr-2 inline-block" />
                            Channel Explorer
                            </TabsTrigger>
                            <TabsTrigger 
                            value="video" 
                            className="rounded-md py-0 px-4 text-base font-medium transition-all duration-200 ease-in-out
                            data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 
                            data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400
                            data-[state=active]:shadow-sm data-[state=active]:font-semibold
                            hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
                            >
                            <Video className="w-5 h-5 mr-2 inline-block" />
                            Video Transcript
                            </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="channel" className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                            <ChannelExtractor onResults={handleResults} setLoading={setLoading} apiKey={apiKey} />
                        </TabsContent>
                        
                        <TabsContent value="video" className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                            <VideoTranscript onResults={handleResults} setLoading={setLoading} apiKey={apiKey} />
                        </TabsContent>
                    </Tabs>
                    </CardContent>
                </Card>

                <AnimatePresence>
                    {loading && (
                        <div className="flex justify-center my-12">
                            <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-black dark:border-gray-700 dark:border-t-white animate-spin"></div>
                        </div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {results && !loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ResultsDisplay results={results} type={activeTab} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
}