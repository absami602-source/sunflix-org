import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { VideoCard } from '../components/VideoCard';
import type { Video } from '../types';
import { toast } from 'sonner';
import apiClient from '../lib/api-client';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Video[]>([]);

  useEffect(() => {
    if (query) {
      // Fetch published videos from API
      apiClient
        .get('/api/videos?status=published')
        .then(res => res.data)
        .then((videos: Video[]) => {
          const searchQuery = query.toLowerCase();
          
          const filtered = videos.filter(video =>
            video.title.toLowerCase().includes(searchQuery) ||
            video.description.toLowerCase().includes(searchQuery) ||
            (video.tags && video.tags.some(tag => tag.toLowerCase().includes(searchQuery))) ||
            video.category.toLowerCase().includes(searchQuery)
          );

          setResults(filtered);
        })
        .catch(error => {
          console.error('Error searching videos:', error);
          toast.error('Failed to search videos');
        });
    }
  }, [query]);

  return (
    <div className="min-h-screen pt-16 bg-[#0E0E10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-6 h-6 text-[#FFB800]" />
            <h1 className="text-3xl text-white">Search Results</h1>
          </div>
          <p className="text-[#A0A0A0]">
            Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </p>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map(video => (
              <VideoCard key={video._id || video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl text-white mb-2">No Results Found</h2>
            <p className="text-[#A0A0A0]">
              Try searching with different keywords
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
