import os
import json
import csv
import requests
import argparse
import re
import html
from datetime import datetime
from urllib.parse import urlparse, parse_qs

def get_video_id_from_url(url):
    """Extract the video ID from a YouTube URL"""
    # Handle different URL formats
    parsed_url = urlparse(url)
    if parsed_url.hostname in ('youtu.be', 'www.youtu.be'):
        return parsed_url.path[1:]
    if parsed_url.hostname in ('youtube.com', 'www.youtube.com'):
        if parsed_url.path == '/watch':
            return parse_qs(parsed_url.query)['v'][0]
        elif parsed_url.path.startswith('/embed/'):
            return parsed_url.path.split('/')[2]
        elif parsed_url.path.startswith('/v/'):
            return parsed_url.path.split('/')[2]
    # Could not extract
    return None

def get_channel_info(api_key, channel_id=None, username=None):
    """Get basic information about a YouTube channel"""
    base_url = "https://www.googleapis.com/youtube/v3/channels"
    
    params = {
        "part": "snippet,statistics,contentDetails",
        "key": api_key
    }
    
    if channel_id:
        params["id"] = channel_id
    elif username:
        params["forUsername"] = username
    else:
        raise ValueError("Either channel_id or username must be provided")
    
    response = requests.get(base_url, params=params)
    response.raise_for_status()  # Raise exception for HTTP errors
    
    data = response.json()
    if "items" not in data or len(data["items"]) == 0:
        raise ValueError("Channel not found")
    
    return data["items"][0]

def get_channel_videos(api_key, channel_id, max_results=50):
    """Get videos from a channel using the uploads playlist"""
    # First, get the uploads playlist ID
    channel_info = get_channel_info(api_key, channel_id=channel_id)
    uploads_playlist_id = channel_info["contentDetails"]["relatedPlaylists"]["uploads"]
    
    # Now get the videos from this playlist
    videos = []
    next_page_token = None
    
    base_url = "https://www.googleapis.com/youtube/v3/playlistItems"
    
    while True:
        params = {
            "part": "snippet,contentDetails",
            "maxResults": 50,  # Maximum allowed by API
            "playlistId": uploads_playlist_id,
            "key": api_key
        }
        
        if next_page_token:
            params["pageToken"] = next_page_token
        
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        
        data = response.json()
        videos.extend(data["items"])
        
        next_page_token = data.get("nextPageToken")
        
        # If we've collected enough videos or there are no more pages
        if not next_page_token or len(videos) >= max_results:
            break
    
    # Truncate to max_results if needed
    return videos[:max_results]

def get_video_details(api_key, video_ids):
    """Get additional details for a list of videos"""
    # YouTube API allows only 50 video IDs per request
    chunks = [video_ids[i:i+50] for i in range(0, len(video_ids), 50)]
    
    all_videos = []
    base_url = "https://www.googleapis.com/youtube/v3/videos"
    
    for chunk in chunks:
        params = {
            "part": "snippet,contentDetails,statistics",
            "id": ",".join(chunk),
            "key": api_key
        }
        
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        
        data = response.json()
        all_videos.extend(data["items"])
    
    return all_videos

def format_video_info(video):
    """Extract relevant information from a video object"""
    snippet = video["snippet"]
    statistics = video.get("statistics", {})
    
    return {
        "video_id": video["id"],
        "title": snippet["title"],
        "description": snippet["description"],
        "published_at": snippet["publishedAt"],
        "thumbnail_url": snippet["thumbnails"]["high"]["url"] if "high" in snippet["thumbnails"] else snippet["thumbnails"]["default"]["url"],
        "view_count": statistics.get("viewCount", "N/A"),
        "like_count": statistics.get("likeCount", "N/A"),
        "comment_count": statistics.get("commentCount", "N/A")
    }

def get_transcript(video_id):
    """Get transcript for a YouTube video by scraping the transcript data"""
    # This uses the unofficial transcript API (no API key required)
    # It's a workaround because official captions API requires OAuth
    
    try:
        # First, we need to get the video page to find transcript data
        url = f"https://www.youtube.com/watch?v={video_id}"
        response = requests.get(url)
        response.raise_for_status()
        html_content = response.text
        
        # Try to find the transcript data in the page
        # Look for the serializedShareEntity JSON
        transcript_pattern = r'\"captionTracks\":\[\{\"baseUrl\":\"([^\"]+)\"'
        matches = re.search(transcript_pattern, html_content)
        
        if not matches:
            return None
            
        # Get the transcript URL
        transcript_url = matches.group(1)
        transcript_url = html.unescape(transcript_url)
        
        # Fetch the transcript data (usually in XML format)
        transcript_response = requests.get(transcript_url)
        transcript_response.raise_for_status()
        transcript_xml = transcript_response.text
        
        # Extract and format the transcript
        # Simple parsing of the XML to extract text and timestamps
        transcript_text_pattern = r'<text start="([^"]+)" dur="([^"]+)">([^<]+)</text>'
        transcript_matches = re.findall(transcript_text_pattern, transcript_xml)
        
        transcript_lines = []
        for start, duration, text in transcript_matches:
            # Convert start time to HH:MM:SS format
            start_seconds = float(start)
            start_time = format_timestamp(start_seconds)
            
            # Decode HTML entities in the text
            text = html.unescape(text)
            
            transcript_lines.append({
                "time": start_time,
                "text": text
            })
        
        return transcript_lines
    
    except Exception as e:
        print(f"Error getting transcript for video {video_id}: {str(e)}")
        return None

def format_timestamp(seconds):
    """Format seconds to HH:MM:SS"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    seconds = int(seconds % 60)
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"

def save_to_json(data, filename):
    """Save data to a JSON file"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def save_to_csv(data, filename):
    """Save data to a CSV file"""
    if not data:
        return
    
    keys = data[0].keys()
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(data)

def save_transcript(transcript, filename, format="txt"):
    """Save transcript to a file (txt or json)"""
    if not transcript:
        return
    
    if format == "json":
        save_to_json(transcript, filename)
    else:  # txt format
        with open(filename, 'w', encoding='utf-8') as f:
            for line in transcript:
                f.write(f"[{line['time']}] {line['text']}\n")

def sanitize_filename(filename):
    """Remove invalid characters from filename"""
    # Remove characters that are invalid in filenames
    return re.sub(r'[\\/*?:"<>|]', "_", filename)

def create_directory_structure(base_dir, channel_id):
    """Create directory structure for output files"""
    # Create main directories
    channel_dir = os.path.join(base_dir, f"channel_{channel_id}")
    videos_dir = os.path.join(channel_dir, "videos")
    transcripts_dir = os.path.join(channel_dir, "transcripts")
    
    os.makedirs(channel_dir, exist_ok=True)
    os.makedirs(videos_dir, exist_ok=True)
    os.makedirs(transcripts_dir, exist_ok=True)
    
    return {
        "channel_dir": channel_dir,
        "videos_dir": videos_dir,
        "transcripts_dir": transcripts_dir
    }

def main():
    parser = argparse.ArgumentParser(description="Extract YouTube channel information, videos, and transcripts")
    
    # Channel identification (either ID or username)
    group = parser.add_mutually_exclusive_group()
    group.add_argument("--channel-id", help="YouTube channel ID")
    group.add_argument("--username", help="YouTube username")
    
    # Single video transcript extraction
    parser.add_argument("--video-url", help="Extract transcript for a single YouTube video URL")
    
    # API key
    parser.add_argument("--api-key", help="YouTube Data API key")
    
    # Output options
    parser.add_argument("--output-format", choices=["json", "csv", "txt"], default="csv", 
                        help="Output format for channel and video data (default: csv)")
    parser.add_argument("--transcript-format", choices=["json", "txt"], default="txt", 
                        help="Output format for transcripts (default: txt)")
    parser.add_argument("--output-dir", default="./youtube_data", 
                        help="Base output directory (default: ./youtube_data)")
    
    # Additional options
    parser.add_argument("--max-videos", type=int, default=50, 
                        help="Maximum number of videos to retrieve (default: 50)")
    parser.add_argument("--with-transcripts", action="store_true", 
                        help="Also extract transcripts for all videos")
    
    args = parser.parse_args()
    
    # Check for valid input
    if not any([args.channel_id, args.username, args.video_url]):
        parser.error("Either --channel-id, --username, or --video-url must be provided")
    
    if (args.channel_id or args.username) and not args.api_key:
        parser.error("--api-key is required when using --channel-id or --username")
    
    try:
        # Case 1: Single video transcript extraction
        if args.video_url:
            video_id = get_video_id_from_url(args.video_url)
            if not video_id:
                raise ValueError("Could not extract video ID from URL")
            
            print(f"Extracting transcript for video ID: {video_id}")
            
            # Get video info if API key is provided
            video_title = f"video_{video_id}"
            if args.api_key:
                video_details = get_video_details(args.api_key, [video_id])
                if video_details:
                    video_title = sanitize_filename(video_details[0]["snippet"]["title"])
            
            # Get and save transcript
            transcript = get_transcript(video_id)
            if not transcript:
                print("No transcript found for this video")
                return
            
            # Create output directory
            os.makedirs(args.output_dir, exist_ok=True)
            
            # Save transcript
            transcript_filename = f"{args.output_dir}/{video_title}.{args.transcript_format}"
            save_transcript(transcript, transcript_filename, args.transcript_format)
            
            print(f"Transcript saved to {transcript_filename}")
            return
        
        # Case 2: Channel extraction
        # Get channel info
        if args.channel_id:
            channel_info = get_channel_info(args.api_key, channel_id=args.channel_id)
        else:
            channel_info = get_channel_info(args.api_key, username=args.username)
            
        channel_id = channel_info["id"]
        channel_title = channel_info["snippet"]["title"]
        
        print(f"Found channel: {channel_title} (ID: {channel_id})")
        
        # Create directory structure
        dirs = create_directory_structure(args.output_dir, channel_id)
        
        # Save channel info
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        channel_filename = f"{dirs['channel_dir']}/info_{timestamp}"
        
        if args.output_format == "json":
            save_to_json(channel_info, f"{channel_filename}.json")
        else:
            # Flatten channel info for CSV
            flat_info = {
                "id": channel_info["id"],
                "title": channel_info["snippet"]["title"],
                "description": channel_info["snippet"]["description"],
                "published_at": channel_info["snippet"]["publishedAt"],
                "view_count": channel_info["statistics"].get("viewCount", "N/A"),
                "subscriber_count": channel_info["statistics"].get("subscriberCount", "N/A"),
                "video_count": channel_info["statistics"].get("videoCount", "N/A")
            }
            save_to_csv([flat_info], f"{channel_filename}.csv")
        
        # Get videos
        print(f"Retrieving up to {args.max_videos} videos...")
        videos = get_channel_videos(args.api_key, channel_id, max_results=args.max_videos)
        
        video_ids = [video["contentDetails"]["videoId"] for video in videos]
        video_details = get_video_details(args.api_key, video_ids)
        
        formatted_videos = [format_video_info(video) for video in video_details]
        
        # Save videos list
        videos_filename = f"{dirs['videos_dir']}/list_{timestamp}"
        
        if args.output_format == "json":
            save_to_json(formatted_videos, f"{videos_filename}.json")
        else:
            save_to_csv(formatted_videos, f"{videos_filename}.csv")
        
        print(f"Successfully retrieved {len(formatted_videos)} videos")
        
        # Extract transcripts if requested
        if args.with_transcripts:
            print("Extracting transcripts... (this may take a while)")
            successful_transcripts = 0
            
            for video in video_details:
                video_id = video["id"]
                video_title = sanitize_filename(video["snippet"]["title"])
                
                print(f"  Processing: {video_title}")
                
                transcript = get_transcript(video_id)
                if transcript:
                    transcript_filename = f"{dirs['transcripts_dir']}/{video_title}.{args.transcript_format}"
                    save_transcript(transcript, transcript_filename, args.transcript_format)
                    successful_transcripts += 1
            
            print(f"Successfully extracted {successful_transcripts} transcripts")
        
        print(f"All data saved to {dirs['channel_dir']}")
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()
