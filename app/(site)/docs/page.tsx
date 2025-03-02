/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Layout from '@/components/Layout';

export default function Documentation() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to App
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">YouTube Explorer Documentation</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <h2>Table of Contents</h2>
          <ul>
            <li><a href="#introduction">Introduction</a></li>
            <li><a href="#getting-started">Getting Started</a></li>
            <li><a href="#features">Feature Guide</a></li>
            <li><a href="#api-key">YouTube API Key</a></li>
            <li><a href="#results">Understanding Results</a></li>
            <li><a href="#faq">FAQs & Troubleshooting</a></li>
          </ul>

          <h2 id="introduction">Introduction</h2>
          <p>
            YouTube Explorer is a comprehensive tool designed to help content creators, marketers, researchers, 
            and YouTube enthusiasts extract valuable data from YouTube channels and videos. Whether you're analyzing 
            competitor channels, researching content trends, or gathering video transcripts for educational purposes, 
            YouTube Explorer streamlines the process with its intuitive interface.
          </p>

          <h3>Core Capabilities:</h3>
          <ul>
            <li>Extract comprehensive channel metrics and statistics</li>
            <li>Retrieve detailed video information from channels</li>
            <li>Extract and download video transcripts with timestamps</li>
            <li>Visualize channel performance data</li>
            <li>Export data in various formats for further analysis</li>
          </ul>

          <h2 id="getting-started">Getting Started</h2>
          <p>To begin using YouTube Explorer, you'll need:</p>
          <ol>
            <li>A modern web browser (Chrome, Firefox, Safari, or Edge)</li>
            <li>A YouTube Data API key (see <a href="#api-key">YouTube API Key</a> section)</li>
            <li>The channel ID or username of the YouTube channel you want to analyze, or a video URL for transcript extraction</li>
          </ol>

          <h2 id="features">Feature Guide</h2>
          
          <h3>Channel Exploration</h3>
          <p>
            The Channel Explorer allows you to extract comprehensive information about a YouTube channel and its videos.
          </p>
          <h4>To extract channel data:</h4>
          <ol>
            <li>Select the "Channel Explorer" tab</li>
            <li>Enter your YouTube API key</li>
            <li>Choose to search by either Channel ID or Username</li>
            <li>Enter the Channel ID or Username in the input field</li>
            <li>Set the maximum number of videos to extract (defaults to 10)</li>
            <li>Toggle "Extract video transcripts" if you want to include transcripts</li>
            <li>Click "Extract Channel Data" to begin the process</li>
          </ol>

          <h3>Video Transcript Extraction</h3>
          <p>
            The Video Transcript feature lets you extract the transcript from a single YouTube video.
          </p>
          <h4>To extract a video transcript:</h4>
          <ol>
            <li>Select the "Video Transcript" tab</li>
            <li>Enter the full YouTube video URL (e.g., {`https://www.youtube.com/watch?v=VIDEO_ID`})</li>
            <li>Choose your preferred transcript format (TXT or JSON)</li>
            <li>Click "Extract Transcript" to retrieve the transcript</li>
          </ol>

          <h2 id="api-key">YouTube API Key</h2>
          <p>To use YouTube Explorer, you need a YouTube Data API key from Google:</p>
          
          <h3>Getting an API Key:</h3>
          <ol>
            <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
            <li>Create a new project or select an existing one</li>
            <li>Navigate to "APIs & Services" -&gt; "Library"</li>
            <li>Search for "YouTube Data API v3" and enable it</li>
            <li>Go to "APIs & Services" -&gt; "Credentials"</li>
            <li>Click "Create Credentials" -&gt; "API Key"</li>
            <li>Copy your new API key</li>
          </ol>

          <h2 id="results">Understanding Results</h2>
          
          <h3>Channel Information:</h3>
          <ul>
            <li><strong>Title</strong>: The channel's display name</li>
            <li><strong>Subscriber Count</strong>: Total number of subscribers</li>
            <li><strong>Video Count</strong>: Total number of public videos</li>
            <li><strong>View Count</strong>: Total views across all videos</li>
            <li><strong>Description</strong>: The channel's self-description</li>
          </ul>
          
          <h3>Video Information:</h3>
          <ul>
            <li><strong>Title</strong>: The title of the video</li>
            <li><strong>Published Date</strong>: When the video was published</li>
            <li><strong>View Count</strong>: Number of views</li>
            <li><strong>Like Count</strong>: Number of likes (if public)</li>
            <li><strong>Comment Count</strong>: Number of comments (if enabled)</li>
            <li><strong>Description</strong>: The video's description</li>
            <li><strong>Thumbnail</strong>: Preview image for the video</li>
          </ul>

          <h2 id="faq">FAQs & Troubleshooting</h2>
          
          <h3>Common Issues:</h3>
          
          <h4>"Channel not found" error</h4>
          <ul>
            <li>Double-check the Channel ID or Username</li>
            <li>Make sure the channel is public and not terminated</li>
          </ul>
          
          <h4>"API key invalid" error</h4>
          <ul>
            <li>Verify that your API key is correct</li>
            <li>Ensure the YouTube Data API is enabled for your key</li>
            <li>Check if you've exceeded your daily quota limit</li>
          </ul>
          
          <h4>"No transcript available" error</h4>
          <ul>
            <li>Not all videos have transcripts</li>
            <li>The video owner may have disabled transcripts</li>
            <li>The video might use a format that doesn't support transcripts</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}