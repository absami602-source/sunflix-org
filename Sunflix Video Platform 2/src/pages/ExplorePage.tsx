import React, { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { VideoCard } from '../components/VideoCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import type { Video } from '../types';
import { toast } from 'sonner';
import apiClient from '../lib/api-client';

export function ExplorePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'views' | 'likes'>('latest');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', 'Entertainment', 'Music', 'Gaming', 'Tech', 'Comedy', 'Education'];

  useEffect(() => {
    loadVideos();
  }, [sortBy, filterCategory]);

  const loadVideos = () => {
    // Fetch published videos from API
    apiClient
      .get('/api/videos?status=published')
      .then(res => res.data)
      .then(allVideos => {
        let filtered = allVideos;

        // Filter by category
        if (filterCategory !== 'all') {
          filtered = filtered.filter((v: any) => v.category === filterCategory);
        }

        // Sort
        switch (sortBy) {
          case 'views':
            filtered.sort((a: any, b: any) => b.views - a.views);
            break;
          case 'likes':
            filtered.sort((a: any, b: any) => b.likes - a.likes);
            break;
          case 'latest':
          default:
            filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        setVideos(filtered);
      })
      .catch(error => {
        console.error('Error loading videos:', error);
        toast.error('Failed to load videos');
      });
  };

  return (
    <div className="min-h-screen pt-16 bg-[#0E0E10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl text-white">Explore Videos</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#A0A0A0]" />
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40 bg-[#1A1A1D] border-white/10">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-40 bg-[#1A1A1D] border-white/10">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
                <SelectItem value="likes">Most Liked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map(video => (
            <VideoCard key={video._id || video.id} video={video} />
          ))}
        </div>

        {videos.length === 0 && (
          <div className="text-center text-[#A0A0A0] py-20">
            No videos found with the current filters
          </div>
        )}
      </div>
    </div>
  );
}
