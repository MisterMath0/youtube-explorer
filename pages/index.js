
// 1. pages/index.js
import { useState } from 'react';
import Head from 'next/head';
import { AnimatePresence, motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '../components/Layout';
import ChannelExtractor from '../../components/ChannelExtractor';
import VideoTranscript from '../components/VideoTranscript';
import ResultsDisplay from '../components/ResultsDisplay';

export default function Home() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('channel');

  const handleResults = (data) => {
    setResults(data);
    setLoading(false);
  };

  return (
    <Layout>
      <Head>
        <title>YouTube Explorer</title>
        <meta name="description" content="Extract YouTube channel information, videos, and transcripts" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-5xl px-4 py-8"
      >
        <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-red-500 to-purple-600 text-transparent bg-clip-text">
          YouTube Explorer
        </h1>
        <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-8">
          Extract channel information, videos, and transcripts with ease
        </p>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <Tabs defaultValue="channel" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="channel">Channel Explorer</TabsTrigger>
                <TabsTrigger value="video">Video Transcript</TabsTrigger>
              </TabsList>
              
              <TabsContent value="channel">
                <ChannelExtractor onResults={handleResults} setLoading={setLoading} />
              </TabsContent>
              
              <TabsContent value="video">
                <VideoTranscript onResults={handleResults} setLoading={setLoading} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center my-12"
            >
              <div className="loader"></div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {results && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ResultsDisplay results={results} type={activeTab} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
}
