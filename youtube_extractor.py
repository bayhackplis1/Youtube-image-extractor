from pytube import YouTube
import logging
from urllib.parse import urlparse, parse_qs

def get_video_id(url):
    """Extract video ID from YouTube URL"""
    parsed_url = urlparse(url)
    if 'youtube.com' in parsed_url.netloc:
        return parse_qs(parsed_url.query).get('v', [None])[0]
    elif 'youtu.be' in parsed_url.netloc:
        return parsed_url.path.lstrip('/')
    return None

def get_video_thumbnails(url):
    """Extract thumbnails from YouTube video URL"""
    try:
        # Validate URL and get video ID
        video_id = get_video_id(url)
        if not video_id:
            raise ValueError("Invalid YouTube URL")

        # Get all available thumbnail URLs
        thumbnails = {
            'maxres': f'https://img.youtube.com/vi/{video_id}/maxresdefault.jpg',
            'high': f'https://img.youtube.com/vi/{video_id}/hqdefault.jpg',
            'medium': f'https://img.youtube.com/vi/{video_id}/mqdefault.jpg',
            'standard': f'https://img.youtube.com/vi/{video_id}/sddefault.jpg',
            'default': f'https://img.youtube.com/vi/{video_id}/default.jpg'
        }

        # Try to get video title, but don't fail if we can't
        title = "YouTube Video"
        try:
            yt = YouTube(url)
            title = yt.title
        except Exception as e:
            logging.warning(f"Could not fetch video title: {str(e)}")

        return {
            'title': title,
            'thumbnails': thumbnails
        }

    except Exception as e:
        logging.error(f"Error extracting thumbnails: {str(e)}")
        raise ValueError("Failed to process YouTube URL")