// MongoDB Document Types

export interface Video {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  uploadedBy: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
  likes: number;
  duration?: number;
  tags?: string[];
  trending?: boolean;
  viral?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  _id?: string;
  id?: string;
  videoId: string;
  userId: string;
  username: string;
  text: string;
  likes: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  _id?: string;
  id?: string;
  senderId: string;
  recipientId: string;
  text: string;
  read: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  updatedAt?: string;
}

export interface Notification {
  _id?: string;
  id?: string;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Ad {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  imageUrl: string;
  redirectUrl: string;
  category?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WatchHistory {
  _id?: string;
  id?: string;
  userId: string;
  videoId: string;
  watchedAt?: string;
  duration?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Settings {
  _id?: string;
  id?: string;
  userId: string;
  theme?: 'light' | 'dark';
  notifications: boolean;
  emailNotifications: boolean;
  privateProfile: boolean;
  createdAt?: string;
  updatedAt?: string;
}
