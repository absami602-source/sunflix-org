import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Sparkles, Star, TrendingUp, Play, Music, Gamepad2, Cpu, Laugh, GraduationCap, Film } from 'lucide-react';
import { VideoCard } from '../components/VideoCard';
import { AdBanner } from '../components/AdBanner';
import { CategoryCard } from '../components/CategoryCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import type { Video } from '../types';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import apiClient from '../lib/api-client';

export function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeCategory, setActiveCategory] = useState('Entertainment');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch videos from MongoDB API
    apiClient
      .get('/api/videos?status=published')
      .then(res => res.data)
      .then(videos => setVideos(videos))
      .catch(error => {
        console.error('Error loading videos:', error);
        toast.error('Failed to load videos');
      });
  }, []);

  const trendingVideos = videos.filter(v => v.trending);
  const viralVideos = videos.filter(v => v.viral);
  const featuredVideos = videos.filter(v => v.featured);

  const categories = [
    { name: 'Entertainment', icon: Film, color: 'from-[#FF7E00]/20 to-[#FFB800]/20' },
    { name: 'Music', icon: Music, color: 'from-[#FF7E00]/20 to-[#6C00FF]/20' },
    { name: 'Gaming', icon: Gamepad2, color: 'from-[#FFB800]/20 to-[#FF7E00]/20' },
    { name: 'Tech', icon: Cpu, color: 'from-[#6C00FF]/20 to-[#8B3FFF]/20' },
    { name: 'Comedy', icon: Laugh, color: 'from-[#FFB800]/20 to-[#FFA500]/20' },
    { name: 'Education', icon: GraduationCap, color: 'from-[#FF7E00]/20 to-[#6C00FF]/20' },
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-background via-card to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF7E00]/20 to-[#6C00FF]/20 border border-[#FF7E00]/30 mb-4">
            <Play className="w-4 h-4 text-[#FFB800]" />
            <span className="text-[#FFB800] text-sm">Watch. Shine. Repeat.</span>
          </div>
          <h1 className="text-4xl md:text-5xl mb-2 bg-gradient-to-r from-[#FF7E00] via-[#C85FFF] to-[#6C00FF] bg-clip-text text-transparent">
            Your Ultimate Entertainment Hub
          </h1>
        </motion.div>

        {/* Banner Ad */}
        <div className="mb-8">
          <AdBanner position="banner" className="w-full h-48 rounded-lg overflow-hidden" />
        </div>
        {/* All Videos Section */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#FF7E00]/20 to-[#6C00FF]/20 border border-[#FF7E00]/30">
                <Play className="w-5 h-5 text-[#FFB800]" />
              </div>
              <div>
                <h2 className="text-3xl text-foreground">All Videos</h2>
                <p className="text-sm text-muted-foreground">Browse our entire collection</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/explore')}
              className="border-[#FF7E00]/50 text-[#FF7E00] hover:bg-[#FF7E00] hover:text-white rounded-full"
            >
              See More
            </Button>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.slice(0, 8).map((video, index) => (
              <motion.div
                key={video._id || video.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <VideoCard video={video} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trending Now Section */}
        {trendingVideos.length > 0 && (
          <section className="mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-6"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#FF7E00]/20 to-[#FFB800]/20 border border-[#FF7E00]/30">
                  <Flame className="w-5 h-5 text-[#FF7E00]" />
                </div>
                <div>
                  <h2 className="text-3xl text-foreground">Trending Now</h2>
                  <p className="text-sm text-muted-foreground">What everyone's watching</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/explore')}
                className="border-[#FF7E00]/50 text-[#FF7E00] hover:bg-[#FF7E00] hover:text-white rounded-full"
              >
                See More
              </Button>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {trendingVideos.slice(0, 8).map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <VideoCard video={video} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Popular Categories Section */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#FFB800]/20 to-[#FF7E00]/20 border border-[#FFB800]/30">
                <Sparkles className="w-5 h-5 text-[#FFB800]" />
              </div>
              <div>
                <h2 className="text-3xl text-foreground">Popular Categories</h2>
                <p className="text-sm text-muted-foreground">Explore by your interests</p>
              </div>
            </div>
          </motion.div>
          
          <Tabs defaultValue="Entertainment" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto bg-card border border-border rounded-xl p-2 mb-6 gap-2">
              {categories.map(cat => (
                <TabsTrigger
                  key={cat.name}
                  value={cat.name}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF7E00] data-[state=active]:to-[#6C00FF] data-[state=active]:text-white rounded-lg px-4 flex items-center gap-2"
                >
                  <cat.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{cat.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {categories.map(cat => (
              <TabsContent key={cat.name} value={cat.name}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {videos
                    .filter(v => v.category === cat.name)
                    .slice(0, 8)
                    .map((video, index) => (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <VideoCard video={video} />
                      </motion.div>
                    ))}
                  {videos.filter(v => v.category === cat.name).length === 0 && (
                    <div className="col-span-4 text-center text-[#A0A0A0] py-12">
                      No videos in this category yet
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Viral This Week Section */}
        {viralVideos.length > 0 && (
          <section className="mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-6"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#6C00FF]/20 to-[#8B3FFF]/20 border border-[#6C00FF]/30">
                  <TrendingUp className="w-5 h-5 text-[#6C00FF]" />
                </div>
                <div>
                  <h2 className="text-3xl text-foreground">Viral This Week</h2>
                  <p className="text-sm text-muted-foreground">Blowing up right now</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/explore')}
                className="border-[#6C00FF]/50 text-[#6C00FF] hover:bg-[#6C00FF] hover:text-white rounded-full"
              >
                See More
              </Button>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {viralVideos.slice(0, 8).map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <VideoCard video={video} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Editor's Pick Section */}
        {featuredVideos.length > 0 && (
          <section className="mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-gradient-to-br from-[#1A1A1D] to-[#0E0E10] border border-white/10 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#FF7E00]/20 to-[#6C00FF]/20 border border-[#FF7E00]/30">
                    <Star className="w-5 h-5 text-[#FFB800]" />
                  </div>
                  <div>
                    <h2 className="text-3xl text-white">Editor's Pick</h2>
                    <p className="text-sm text-[#A0A0A0]">Hand-selected by our team</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate('/explore')}
                  className="border-[#FFB800]/50 text-[#FFB800] hover:bg-[#FFB800] hover:text-white rounded-full"
                >
                  See More
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {featuredVideos.slice(0, 4).map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <VideoCard video={video} featured />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        )}
      </div>
    </div>
  );
}
