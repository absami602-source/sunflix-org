import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Heart, History, Settings, PlayCircle, Users, Edit2, Check, X, Sparkles, TrendingUp, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import type { Video } from '../types';
import { VideoCard } from '../components/VideoCard';
import { toast } from 'sonner';
import apiClient from '../lib/api-client';

export function UserProfilePage() {
  const { user, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [watchHistory, setWatchHistory] = useState<any[]>([]);
  const [likedVideos, setLikedVideos] = useState<Video[]>([]);
  const [favoriteVideos, setFavoriteVideos] = useState<Video[]>([]);
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  
  const [preferences, setPreferences] = useState({
    theme: 'dark' as 'dark' | 'light',
    autoplay: true,
    notifications: true,
  });

  // Helper functions for preferences (localStorage fallback for UI theme)
  const getUserPreferences = (userId: string | undefined) => {
    if (!userId) return null;
    try {
      const stored = localStorage.getItem(`prefs_${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const saveUserPreferences = (prefs: any) => {
    if (!prefs.userId) return;
    try {
      localStorage.setItem(`prefs_${prefs.userId}`, JSON.stringify(prefs));
    } catch {
      // Silently fail if localStorage is not available
    }
  };

  useEffect(() => {
    // Fetch all videos
    apiClient
      .get('/api/videos')
      .then(res => res.data)
      .then(videos => setAllVideos(videos))
      .catch(error => console.error('Error loading videos:', error));

    // Fetch user's watch history and set user data
    if (user) {
      apiClient
        .get(`/api/users/${encodeURIComponent(user._id || user.id)}/watch-history`)
        .then(res => res.data)
        .then(history => setWatchHistory(history))
        .catch(error => {
          console.error('Error loading watch history:', error);
          // Keep watchHistory empty on failures; user experience should not break
          setWatchHistory([]);
        });

      // Set liked videos and subscriptions from user object
      if (user.likedVideos) {
        setLikedVideos(user.likedVideos as any);
      }
      if (user.subscriptions) {
        setSubscriptions(user.subscriptions);
      }
    }
  }, [user]);

  const historyVideos = watchHistory
    .map((h: any) => allVideos.find(v => v._id === h.videoId || v.id === h.videoId))
    .filter(Boolean)
    .reverse()
    .slice(0, 12);

  const likedVideosList = allVideos.filter(v => likedVideos.includes(v.id));
  const favoriteVideosList = allVideos.filter(v => favoriteVideos.includes(v.id));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const savedPrefs = getUserPreferences(user.id);
    if (savedPrefs) {
      setPreferences(savedPrefs);
    }
  }, [user, navigate]);

  const handleSaveProfile = () => {
    if (!user) return;

    updateUserProfile({ name, avatar });
    toast.success('Profile updated successfully!');
    setEditing(false);
  };

  const handleSavePreferences = () => {
    if (!user) return;

    saveUserPreferences({
      userId: user.id,
      ...preferences
    });
    toast.success('Preferences saved!');
  };

  if (!user) {
    return null;
  }

  const stats = [
    { label: 'Watched', value: historyVideos.length, icon: PlayCircle, color: 'from-[#FF7E00] to-[#FFB800]' },
    { label: 'Liked', value: likedVideos.length, icon: Heart, color: 'from-[#6C00FF] to-[#8B3FFF]' },
    { label: 'Favorites', value: favoriteVideos.length, icon: Star, color: 'from-[#FFB800] to-[#FF7E00]' },
    { label: 'Subscriptions', value: subscriptions.length, icon: Users, color: 'from-[#FF7E00] to-[#6C00FF]' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-background via-[#1A1A1D] to-background">
      <div className="max-w-7xl mx-auto">
        {/* Premium Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl mb-8 bg-gradient-to-br from-card to-card/50 border border-border shadow-2xl"
        >
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF7E00]/10 via-transparent to-[#6C00FF]/10" />
          
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] rounded-full blur-xl opacity-50" />
                <Avatar className="w-32 h-32 ring-4 ring-[#FF7E00]/30 relative z-10">
                  <AvatarImage src={avatar || user.avatar} />
                  <AvatarFallback className="text-4xl bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] text-white">
                    {(user.name?.charAt(0) ?? '?').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              <div className="flex-1 text-center md:text-left">
                {editing ? (
                  <div className="space-y-4 max-w-md">
                    <div>
                      <Label className="text-foreground">Name</Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-background/50 border-border mt-1"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground">Avatar URL</Label>
                      <Input
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        className="bg-background/50 border-border mt-1"
                        placeholder="Avatar URL (optional)"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveProfile}
                        size="sm"
                        className="bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] hover:opacity-90"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          setEditing(false);
                          setName(user.name);
                          setAvatar(user.avatar || '');
                        }}
                        size="sm"
                        variant="outline"
                        className="border-border"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                      <h1 className="text-4xl bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] bg-clip-text text-transparent">
                        {user.name}
                      </h1>
                      <Button
                        onClick={() => setEditing(true)}
                        size="icon"
                        variant="ghost"
                        className="hover:bg-background/50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-muted-foreground mb-6">{user.email}</p>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {stats.map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="bg-background/50 border-border hover:border-[#FF7E00]/50 transition-all">
                            <CardContent className="p-4 text-center">
                              <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${stat.color} mb-2`}>
                                <stat.icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="text-2xl bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] bg-clip-text text-transparent">
                                {stat.value}
                              </div>
                              <div className="text-xs text-muted-foreground">{stat.label}</div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Premium Tabs */}
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-card border border-border rounded-xl p-1 mb-8 h-auto">
            {[
              { value: 'history', icon: History, label: 'History' },
              { value: 'liked', icon: Heart, label: 'Liked' },
              { value: 'favorites', icon: Star, label: 'Favorites' },
              { value: 'settings', icon: Settings, label: 'Settings' },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF7E00] data-[state=active]:to-[#6C00FF] data-[state=active]:text-white rounded-lg py-3"
              >
                <tab.icon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Watch History */}
          <TabsContent value="history">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {historyVideos.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-[#FF7E00]/20 to-[#FFB800]/20 border border-[#FF7E00]/30">
                      <History className="w-5 h-5 text-[#FF7E00]" />
                    </div>
                    <h2 className="text-2xl text-foreground">Watch History</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {historyVideos.map((video: any, index) => (
                      <motion.div
                        key={video._id || video.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <VideoCard video={video} />
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="pt-12 pb-12 text-center">
                    <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-[#FF7E00]/20 to-[#6C00FF]/20 mb-4">
                      <History className="w-12 h-12 text-[#FF7E00]" />
                    </div>
                    <h3 className="text-xl text-foreground mb-2">No watch history yet</h3>
                    <p className="text-muted-foreground mb-6">Start watching videos to see them here</p>
                    <Button
                      onClick={() => navigate('/')}
                      className="bg-gradient-to-r from-[#FF7E00] to-[#6C00FF]"
                    >
                      Browse Videos
                    </Button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </TabsContent>

          {/* Liked Videos */}
          <TabsContent value="liked">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {likedVideosList.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-[#6C00FF]/20 to-[#8B3FFF]/20 border border-[#6C00FF]/30">
                      <Heart className="w-5 h-5 text-[#6C00FF]" />
                    </div>
                    <h2 className="text-2xl text-foreground">Liked Videos</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {likedVideosList.map((video: any, index) => (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <VideoCard video={video} />
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="pt-12 pb-12 text-center">
                    <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-[#6C00FF]/20 to-[#8B3FFF]/20 mb-4">
                      <Heart className="w-12 h-12 text-[#6C00FF]" />
                    </div>
                    <h3 className="text-xl text-foreground mb-2">No liked videos yet</h3>
                    <p className="text-muted-foreground mb-6">Like videos to see them here</p>
                    <Button
                      onClick={() => navigate('/')}
                      className="bg-gradient-to-r from-[#FF7E00] to-[#6C00FF]"
                    >
                      Browse Videos
                    </Button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </TabsContent>

          {/* Favorite Videos */}
          <TabsContent value="favorites">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {favoriteVideosList.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-[#FFB800]/20 to-[#FF7E00]/20 border border-[#FFB800]/30">
                      <Star className="w-5 h-5 text-[#FFB800]" />
                    </div>
                    <h2 className="text-2xl text-foreground">Favorite Videos</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favoriteVideosList.map((video: any, index) => (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <VideoCard video={video} />
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <Card className="bg-card border-border">
                  <CardContent className="pt-12 pb-12 text-center">
                    <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-[#FFB800]/20 to-[#FF7E00]/20 mb-4">
                      <Star className="w-12 h-12 text-[#FFB800]" />
                    </div>
                    <h3 className="text-xl text-foreground mb-2">No favorite videos yet</h3>
                    <p className="text-muted-foreground mb-6">Add videos to favorites to see them here</p>
                    <Button
                      onClick={() => navigate('/')}
                      className="bg-gradient-to-r from-[#FF7E00] to-[#6C00FF]"
                    >
                      Browse Videos
                    </Button>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#FF7E00]/20 to-[#6C00FF]/20 border border-[#FF7E00]/30">
                  <Settings className="w-5 h-5 text-[#FF7E00]" />
                </div>
                <h2 className="text-2xl text-foreground">Account Settings</h2>
              </div>
              
              <div className="grid gap-6 max-w-2xl">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#FFB800]" />
                      Preferences
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Manage your viewing preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border">
                      <div>
                        <Label htmlFor="autoplay" className="text-foreground">Autoplay</Label>
                        <p className="text-sm text-muted-foreground">Automatically play next video</p>
                      </div>
                      <Switch
                        id="autoplay"
                        checked={preferences.autoplay}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, autoplay: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border">
                      <div>
                        <Label htmlFor="notifications" className="text-foreground">Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive updates and notifications</p>
                      </div>
                      <Switch
                        id="notifications"
                        checked={preferences.notifications}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, notifications: checked }))}
                      />
                    </div>

                    <Button
                      onClick={handleSavePreferences}
                      className="w-full bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] hover:opacity-90"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Account Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={logout}
                      variant="outline"
                      className="w-full border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      Logout
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
