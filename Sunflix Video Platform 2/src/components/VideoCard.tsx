import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ThumbsUp, Play, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Video } from '../types';
import { Badge } from './ui/badge';

// Helper to extract YouTube thumbnail
const getYouTubeThumbnail = (url: string, quality: string = 'hq') => {
  const videoId = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)?.[1];
  if (!videoId) return '/placeholder.jpg';
  const qualityMap: any = { hq: 'maxresdefault', mq: 'mqdefault', default: 'default' };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality] || 'hqdefault'}.jpg`;
};

interface VideoCardProps {
  video: Video;
  featured?: boolean;
  [key: string]: any; // Allow any other props
}

export function VideoCard({ video, featured, ...props }: VideoCardProps) {
  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const getTimeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    const days = Math.floor(seconds / 86400);
    if (days > 0) return `${days}d ago`;
    const hours = Math.floor(seconds / 3600);
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  // Get thumbnail URL, prioritize stored thumbnail, fallback to YouTube thumbnail
  const thumbnailUrl = video.thumbnail || getYouTubeThumbnail(video.url, 'hq');

  const videoId = video._id || video.id;

  const card = (
    <div className={`bg-gradient-to-br from-card-foreground/5 to-card/50 rounded-2xl overflow-hidden shadow-xl border border-border hover:border-[#FF7E00]/50 transition-all duration-300 h-full flex flex-col ${
      featured ? 'min-h-96' : 'min-h-80'
    }`}>
          {/* Thumbnail */}
          <div className="relative h-48 bg-gradient-to-br from-[#FF7E00]/20 via-card to-[#6C00FF]/20 overflow-hidden">
            {/* Real Thumbnail Image */}
            {thumbnailUrl ? (
              <img 
                src={thumbnailUrl} 
                alt={video.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Replace with local placeholder if external thumbnail fails to load
                  try {
                    e.currentTarget.src = '/placeholder.jpg';
                  } catch (err) {
                    e.currentTarget.style.display = 'none';
                  }
                }}
              />
            ) : null}
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF7E00]/30 to-[#6C00FF]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                className="opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] blur-xl" />
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] flex items-center justify-center shadow-2xl">
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Badges */}
            <div className="absolute top-3 right-3 flex gap-2">
              {video.trending && (
                <Badge className="bg-gradient-to-r from-[#FF1744] to-[#FF4569] border-none shadow-lg backdrop-blur-sm">
                  🔥 Trending
                </Badge>
              )}
              {video.viral && (
                <Badge className="bg-gradient-to-r from-[#00E676] to-[#00FFB3] border-none text-black shadow-lg backdrop-blur-sm">
                  🚀 Viral
                </Badge>
              )}
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
          </div>

          {/* Info */}
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="text-foreground line-clamp-2 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#FF7E00] group-hover:to-[#6C00FF] group-hover:bg-clip-text transition-all duration-300">
              {video.title}
            </h3>
            
            <div className="flex items-center justify-between text-muted-foreground text-sm mb-3">
              <div className="flex items-center space-x-4">
                <span className="flex items-center group-hover:text-[#FFB800] transition-colors">
                  <Eye className="w-4 h-4 mr-1" />
                  {formatViews(video.views)}
                </span>
                <span className="flex items-center group-hover:text-[#FFB800] transition-colors">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {formatViews(video.likes)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <Badge 
                variant="outline" 
                className="border-[#FF7E00]/50 text-[#FF7E00] bg-[#FF7E00]/10 backdrop-blur-sm group-hover:border-[#FFB800] group-hover:text-[#FFB800] transition-all"
              >
                {video.category}
              </Badge>
              <span className="flex items-center text-xs text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" />
                {getTimeSince(video.createdAt)}
              </span>
            </div>
          </div>

          {/* Bottom glow */}
          <div className="h-1 bg-gradient-to-r from-[#FF7E00] via-[#FFB800] to-[#6C00FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );

  return (
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3, ease: 'easeOut' }} className="group h-full">
      {videoId ? <Link to={`/video/${videoId}`}>{card}</Link> : card}
    </motion.div>
  );
}