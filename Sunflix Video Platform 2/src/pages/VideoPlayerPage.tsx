import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThumbsUp, Share2, Eye, Calendar, Maximize, Send, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { VideoCard } from '../components/VideoCard';
import type { Video, Comment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { convertToEmbedUrl } from '../lib/video-utils';
import apiClient from '../lib/api-client';

export function VideoPlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Protect against literal 'undefined' string (can happen if IDs were missing when linking)
    if (id && id !== 'undefined') {
      // Fetch video from API via centralized apiClient (ensures correct baseURL and auth)
      apiClient
        .get(`/api/videos/${id}`)
        .then(res => res.data)
        .then(currentVideo => {
          setVideo(currentVideo);

          // Increment views via API (fire-and-forget)
          apiClient
            .post(`/api/videos/${id}/views`)
            .catch(err => console.error('Error updating views:', err));

          // Add to user's watch history (requires auth token). Server uses token to identify user.
          if (user) {
            apiClient
              .post('/api/watch-history', { videoId: id })
              .catch(err => console.error('Error adding to watch history:', err));
          }

          // Get related videos from same category
          return apiClient.get(`/api/videos?category=${encodeURIComponent(currentVideo.category || '')}`);
        })
        .then(res => res.data as Video[])
        .then((videos: Video[]) => {
          const related = videos
            .filter(v => v._id !== id && v.id !== id && v.status === 'published')
            .slice(0, 6);
          setRelatedVideos(related);
        })
        .catch(error => {
          console.error('Error loading video:', error);
          toast.error('Failed to load video');
          navigate('/');
        });

        // Load comments
        loadComments();
    }
  }, [id]);

  const loadComments = () => {
    if (id) {
      apiClient
        .get(`/api/videos/${encodeURIComponent(id)}/comments`)
        .then(res => res.data)
        .then(videoComments => setComments(videoComments))
        .catch(error => console.error('Error loading comments:', error));
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like videos');
      navigate('/login');
      return;
    }

    if (!id || !video) return;

    try {
        // Use server endpoints for liking/unliking which handle increment atomically and require auth
        let response;
        if (liked) {
          response = await apiClient.post(`/api/videos/${id}/unlike`);
        } else {
          response = await apiClient.post(`/api/videos/${id}/like`);
        }
        if (!response || response.status >= 400) throw new Error('Failed to update likes');

        const updated = response.data;
        setVideo({ ...video, likes: updated.likes ?? (video.likes ?? 0) + (liked ? -1 : 1) });
        setLiked(!liked);
        toast.success(liked ? 'Like removed' : 'Video liked!');
    } catch (error) {
      console.error('Error updating likes:', error);
      toast.error('Failed to update likes');
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const handleFullscreen = () => {
    if (videoContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoContainerRef.current.requestFullscreen();
      }
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      toast.error('Please login to comment');
      navigate('/login');
      return;
    }

    if (!commentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    if (!id || !video) return;

    try {
      const response = await apiClient.post(`/api/videos/${encodeURIComponent(id)}/comments`, {
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        text: commentText.trim()
      });

      if (!response || response.status >= 400) throw new Error('Failed to add comment');

      const newComment = response.data;
      setComments([...comments, newComment]);
      setCommentText('');
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;
    
    const comment = comments.find((c: any) => c.id === commentId || c._id === commentId);
    if (comment && (comment.userId === user.id || comment.userId === user._id)) {
      try {
  const response = await apiClient.delete(`/api/comments/${commentId}`);
  if (!response || response.status >= 400) throw new Error('Failed to delete comment');

        setComments(comments.filter((c: any) => c.id !== commentId && c._id !== commentId));
        toast.success('Comment deleted');
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast.error('Failed to delete comment');
      }
    }
  };

  const getTimeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    const days = Math.floor(seconds / 86400);
    if (days > 0) return `${days}d ago`;
    const hours = Math.floor(seconds / 3600);
    if (hours > 0) return `${hours}h ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (!video) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-background">
        <div className="text-foreground text-xl">Video not found</div>
      </div>
    );
  }

  // Convert video URL to embed format with ad-blocking enabled
  const embedUrl = convertToEmbedUrl(video.url, true);

  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Section */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div 
              ref={videoContainerRef}
              className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-6 group"
            >
              <iframe
                ref={iframeRef}
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
              />
              
              {/* Fullscreen Button Overlay */}
              <motion.button
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                onClick={handleFullscreen}
                className="absolute bottom-4 right-4 p-3 bg-black/70 hover:bg-black/90 text-white rounded-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
              >
                <Maximize className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Video Info */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl text-foreground mb-2">{video.title}</h1>
                  <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {(video.views ?? 0).toLocaleString()} views
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {video.createdAt ? new Date(video.createdAt).toLocaleDateString() : '—'}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-[#6C00FF] text-[#6C00FF]"
                >
                  {video.category}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-border">
                <Button
                  onClick={handleLike}
                  variant={liked ? 'default' : 'outline'}
                  className={
                    liked
                      ? 'bg-gradient-to-r from-[#FF7E00] to-[#6C00FF]'
                      : 'border-border hover:border-[#FF7E00]'
                  }
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  {(video.likes ?? 0).toLocaleString()}
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="border-border hover:border-[#FFB800]"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground">{video.description}</p>
              </div>

              {/* Tags */}
              {video.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-foreground mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {video.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-[#FF7E00]/20 text-[#FFB800] hover:bg-[#FF7E00]/30 cursor-pointer"
                        onClick={() => navigate(`/search?q=${tag}`)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="mt-6 bg-card rounded-lg p-6 border border-border">
              <h3 className="text-foreground mb-4">
                Comments ({comments.length})
              </h3>

              {/* Add Comment */}
              {user ? (
                <div className="mb-6">
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="bg-background border-border mb-2"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                      className="bg-gradient-to-r from-[#FF7E00] to-[#6C00FF]"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Comment
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-background rounded-lg border border-border text-center">
                  <p className="text-muted-foreground mb-2">
                    Please login to comment
                  </p>
                  <Button
                    onClick={() => navigate('/login')}
                    variant="outline"
                    className="border-[#6C00FF] text-[#6C00FF]"
                  >
                    Login
                  </Button>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map(comment => (
                    <motion.div
                      key={comment._id || comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-background rounded-lg border border-border"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3 flex-1">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] flex items-center justify-center flex-shrink-0">
                            <span className="text-white">
                              {(comment.userName?.charAt(0) ?? '?').toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-foreground">
                                {comment.userName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {getTimeSince(comment.createdAt ?? new Date().toISOString())}
                              </span>
                            </div>
                            <p className="text-foreground text-sm">
                              {comment.text}
                            </p>
                          </div>
                        </div>
                        {user && comment.userId === user.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Related Videos Sidebar */}
          <div className="lg:col-span-1">
            <h2 className="text-xl text-foreground mb-4">Related Videos</h2>
            <div className="space-y-4">
              {relatedVideos.map(relatedVideo => (
                <VideoCard key={relatedVideo.id} video={relatedVideo} />
              ))}
              {relatedVideos.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  No related videos found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}