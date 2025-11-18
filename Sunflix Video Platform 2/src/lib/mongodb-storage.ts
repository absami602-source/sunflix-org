import apiClient from './api-client';

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface Video {
  _id?: string;
  id?: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  thumbnail: string;
  views: number;
  likes: number;
  category: string;
  status: 'draft' | 'published';
  featured: boolean;
  trending: boolean;
  viral: boolean;
  sponsored: boolean;
  createdAt: string;
  creatorId?: string;
  creatorName?: string;
}

export interface Comment {
  _id?: string;
  id?: string;
  videoId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  likes: number;
  createdAt: string;
}

export interface Notification {
  _id?: string;
  id?: string;
  userId: string;
  type: 'like' | 'comment' | 'reply' | 'video' | 'system';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Message {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Ad {
  _id?: string;
  id?: string;
  title: string;
  imageUrl: string;
  clickUrl: string;
  position: 'banner' | 'sidebar' | 'between-rows' | 'pre-roll';
  active: boolean;
  impressions: number;
  clicks: number;
  createdAt: string;
}

export interface WatchHistory {
  userId: string;
  videoId: string;
  watchedAt: string;
}

export interface UserPreferences {
  userId: string;
  theme: 'dark' | 'light';
  autoplay: boolean;
  notifications: boolean;
}

export interface Settings {
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  approved: boolean;
  favorites: string[];
  subscriptions: string[];
  likedVideos?: string[];
  createdAt?: string;
}

// =====================================================
// VIDEO OPERATIONS
// =====================================================

export async function getAllVideos(category?: string): Promise<Video[]> {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    const response = await apiClient.get(`/api/videos?${params}`);
    const videos = response.data || [];
    // Normalize MongoDB _id to id for frontend consistency
    return (videos || []).map((v: any) => ({ ...v, id: v._id || v.id }));
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
}

export async function getVideoById(id: string): Promise<Video | null> {
  try {
    const response = await apiClient.get(`/api/videos/${id}`);
    return response.data || null;
  } catch (error) {
    console.error('Error fetching video:', error);
    return null;
  }
}

export async function createVideo(video: Partial<Video>): Promise<Video | null> {
  try {
    const response = await apiClient.post('/api/videos', video);
    return response.data || null;
  } catch (error) {
    console.error('Error creating video:', error);
    return null;
  }
}

export async function updateVideo(id: string, video: Partial<Video>): Promise<Video | null> {
  try {
    const response = await apiClient.put(`/api/videos/${id}`, video);
    return response.data || null;
  } catch (error) {
    console.error('Error updating video:', error);
    return null;
  }
}

export async function deleteVideo(id: string): Promise<boolean> {
  try {
    await apiClient.delete(`/api/videos/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting video:', error);
    return false;
  }
}

export async function searchVideos(query: string): Promise<Video[]> {
  try {
    const response = await apiClient.get('/api/videos/search', { params: { q: query } });
    return response.data || [];
  } catch (error) {
    console.error('Error searching videos:', error);
    return [];
  }
}

export async function getTrendingVideos(): Promise<Video[]> {
  try {
    const response = await apiClient.get('/api/videos/trending/list');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching trending videos:', error);
    return [];
  }
}

export async function getFeaturedVideos(): Promise<Video[]> {
  try {
    const response = await apiClient.get('/api/videos/featured/list');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching featured videos:', error);
    return [];
  }
}

// =====================================================
// COMMENT OPERATIONS
// =====================================================

export async function getVideoComments(videoId: string): Promise<Comment[]> {
  try {
    const response = await apiClient.get(`/api/videos/${videoId}/comments`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export async function createComment(videoId: string, comment: Partial<Comment>): Promise<Comment | null> {
  try {
    const response = await apiClient.post(`/api/videos/${videoId}/comments`, comment);
    return response.data || null;
  } catch (error) {
    console.error('Error creating comment:', error);
    return null;
  }
}

export async function deleteComment(commentId: string): Promise<boolean> {
  try {
    await apiClient.delete(`/api/comments/${commentId}`);
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
}

export async function likeComment(commentId: string): Promise<boolean> {
  try {
    await apiClient.post(`/api/comments/${commentId}/like`);
    return true;
  } catch (error) {
    console.error('Error liking comment:', error);
    return false;
  }
}

// =====================================================
// USER OPERATIONS
// =====================================================

export async function getAllUsers(): Promise<User[]> {
  try {
    const response = await apiClient.get('/api/users');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  try {
    const response = await apiClient.put(`/api/users/${id}`, updates);
    return response.data || null;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

export async function approveUser(id: string): Promise<boolean> {
  try {
    await apiClient.post(`/api/users/${id}/approve`);
    return true;
  } catch (error) {
    console.error('Error approving user:', error);
    return false;
  }
}

// =====================================================
// MESSAGE OPERATIONS
// =====================================================

export async function getAllMessages(): Promise<Message[]> {
  try {
    const response = await apiClient.get('/api/messages');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

export async function createMessage(message: Partial<Message>): Promise<Message | null> {
  try {
    const response = await apiClient.post('/api/messages', message);
    return response.data || null;
  } catch (error) {
    console.error('Error creating message:', error);
    return null;
  }
}

export async function deleteMessage(id: string): Promise<boolean> {
  try {
    await apiClient.delete(`/api/messages/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting message:', error);
    return false;
  }
}

export async function markMessageAsRead(id: string): Promise<boolean> {
  try {
    await apiClient.put(`/api/messages/${id}/read`);
    return true;
  } catch (error) {
    console.error('Error marking message as read:', error);
    return false;
  }
}

// =====================================================
// NOTIFICATION OPERATIONS
// =====================================================

export async function getUserNotifications(userId: string): Promise<Notification[]> {
  try {
    const response = await apiClient.get(`/api/users/${userId}/notifications`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

export async function createNotification(notification: Partial<Notification>): Promise<Notification | null> {
  try {
    const response = await apiClient.post('/api/notifications', notification);
    return response.data || null;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  try {
    await apiClient.put(`/api/notifications/${id}/read`);
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
}

// =====================================================
// AD OPERATIONS
// =====================================================

export async function getAllAds(): Promise<Ad[]> {
  try {
    const response = await apiClient.get('/api/ads');
    // Normalize _id to id for frontend consistency
    const ads = response.data || [];
    return ads.map((a: any) => ({ ...a, id: a._id || a.id }));
  } catch (error) {
    console.error('Error fetching ads:', error);
    return [];
  }
}

export async function createAd(ad: Partial<Ad>): Promise<Ad | null> {
  try {
    const response = await apiClient.post('/api/ads', ad);
    return response.data || null;
  } catch (error) {
    console.error('Error creating ad:', error);
    return null;
  }
}

export async function updateAd(id: string, ad: Partial<Ad>): Promise<Ad | null> {
  try {
    const response = await apiClient.put(`/api/ads/${id}`, ad);
    return response.data || null;
  } catch (error) {
    console.error('Error updating ad:', error);
    return null;
  }
}

export async function deleteAd(id: string): Promise<boolean> {
  try {
    await apiClient.delete(`/api/ads/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting ad:', error);
    return false;
  }
}

// =====================================================
// SETTINGS OPERATIONS
// =====================================================

export async function getSettings(): Promise<Settings | null> {
  try {
    const response = await apiClient.get('/api/settings');
    return response.data || null;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
}

export async function updateSettings(settings: Partial<Settings>): Promise<Settings | null> {
  try {
    const response = await apiClient.put('/api/settings', settings);
    return response.data || null;
  } catch (error) {
    console.error('Error updating settings:', error);
    return null;
  }
}

// =====================================================
// WATCH HISTORY OPERATIONS
// =====================================================

export async function addToWatchHistory(videoId: string): Promise<boolean> {
  try {
    // Server derives the user from the Authorization token; only send videoId
    await apiClient.post('/api/watch-history', { videoId });
    return true;
  } catch (error) {
    console.error('Error adding to watch history:', error);
    return false;
  }
}

export async function getWatchHistory(userId: string): Promise<WatchHistory[]> {
  try {
    const response = await apiClient.get(`/api/users/${userId}/watch-history`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching watch history:', error);
    return [];
  }
}

// =====================================================
// VIDEO INTERACTIONS
// =====================================================

export async function likeVideo(videoId: string): Promise<boolean> {
  try {
    await apiClient.post(`/api/videos/${videoId}/like`);
    return true;
  } catch (error) {
    console.error('Error liking video:', error);
    return false;
  }
}

export async function unlikeVideo(videoId: string): Promise<boolean> {
  try {
    await apiClient.post(`/api/videos/${videoId}/unlike`);
    return true;
  } catch (error) {
    console.error('Error unliking video:', error);
    return false;
  }
}

export async function addToFavorites(userId: string, videoId: string): Promise<boolean> {
  try {
    await apiClient.post(`/api/users/${userId}/favorites`, { videoId });
    return true;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
}

export async function removeFromFavorites(userId: string, videoId: string): Promise<boolean> {
  try {
    await apiClient.delete(`/api/users/${userId}/favorites/${videoId}`);
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
}

export async function getUserFavorites(userId: string): Promise<Video[]> {
  try {
    const response = await apiClient.get(`/api/users/${userId}/favorites`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
}

// =====================================================
// EXPORT INITIALIZATION FUNCTION (for app startup)
// =====================================================

export async function initializeStorage(): Promise<void> {
  // With MongoDB, we don't need localStorage initialization
  // Everything is handled via API
  console.log('Storage initialized (MongoDB API)');
}
