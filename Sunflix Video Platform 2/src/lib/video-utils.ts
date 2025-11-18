// Universal Video Platform Support with Ad-Blocking

// Detect video platform from URL
export function detectVideoPlatform(url: string): 'youtube' | 'vimeo' | 'dailymotion' | 'facebook' | 'other' {
  if (/youtube\.com|youtu\.be/i.test(url)) return 'youtube';
  if (/vimeo\.com/i.test(url)) return 'vimeo';
  if (/dailymotion\.com|dai\.ly/i.test(url)) return 'dailymotion';
  if (/facebook\.com|fb\.watch/i.test(url)) return 'facebook';
  return 'other';
}

// Extract YouTube video ID
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&?/]+)/i
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Extract Vimeo video ID
export function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/i);
  return match ? match[1] : null;
}

// Extract Dailymotion video ID
export function extractDailymotionId(url: string): string | null {
  const patterns = [
    /dailymotion\.com\/video\/([^_]+)/i,
    /dai\.ly\/([^?]+)/i
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Convert any video URL to embed URL with ad-blocking parameters
export function convertToEmbedUrl(url: string, blockAds: boolean = true): string {
  const platform = detectVideoPlatform(url);
  
  switch (platform) {
    case 'youtube': {
      const videoId = extractYouTubeId(url);
      if (!videoId) return url;
      // Add parameters to minimize ads: modestbranding, rel=0, etc.
      const params = blockAds 
        ? '?modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=0'
        : '';
      return `https://www.youtube.com/embed/${videoId}${params}`;
    }
    
    case 'vimeo': {
      const videoId = extractVimeoId(url);
      if (!videoId) return url;
      // Vimeo ad-free parameters
      const params = blockAds ? '?title=0&byline=0&portrait=0' : '';
      return `https://player.vimeo.com/video/${videoId}${params}`;
    }
    
    case 'dailymotion': {
      const videoId = extractDailymotionId(url);
      if (!videoId) return url;
      // Dailymotion ad-control parameters
      const params = blockAds ? '?ui-start-screen-info=0&sharing-enable=0' : '';
      return `https://www.dailymotion.com/embed/video/${videoId}${params}`;
    }
    
    case 'facebook': {
      // Facebook embed is tricky, just return the original URL
      return url;
    }
    
    default:
      // For other platforms or direct embeds, return as is
      return url;
  }
}

// Get video thumbnail from any platform
export function getVideoThumbnail(url: string, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'hq'): string {
  const platform = detectVideoPlatform(url);
  
  switch (platform) {
    case 'youtube': {
      const videoId = extractYouTubeId(url);
      if (!videoId) return '';
      
      const qualityMap = {
        'default': 'default',
        'mq': 'mqdefault',
        'hq': 'hqdefault',
        'sd': 'sddefault',
        'maxres': 'maxresdefault'
      };
      
      return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
    }
    
    case 'vimeo': {
      const videoId = extractVimeoId(url);
      if (!videoId) return '';
      // Vimeo thumbnails require API call, return placeholder
      // In production, you'd fetch from: https://vimeo.com/api/v2/video/${videoId}.json
      return `https://i.vimeocdn.com/video/${videoId}_640.jpg`;
    }
    
    case 'dailymotion': {
      const videoId = extractDailymotionId(url);
      if (!videoId) return '';
      return `https://www.dailymotion.com/thumbnail/video/${videoId}`;
    }
    
    default:
      return '';
  }
}

// Check if URL is a valid video URL
export function isValidVideoUrl(url: string): boolean {
  if (!url) return false;
  
  const platform = detectVideoPlatform(url);
  if (platform === 'other') {
    // Check if it's an embed URL or has video file extension
    return /\/(embed|player|watch|video)/i.test(url) || 
           /\.(mp4|webm|ogg|mov)$/i.test(url);
  }
  
  return true;
}

// Get video platform name for display
export function getVideoPlatformName(url: string): string {
  const platform = detectVideoPlatform(url);
  const names: Record<string, string> = {
    youtube: 'YouTube',
    vimeo: 'Vimeo',
    dailymotion: 'Dailymotion',
    facebook: 'Facebook',
    other: 'Video'
  };
  return names[platform] || 'Video';
}
