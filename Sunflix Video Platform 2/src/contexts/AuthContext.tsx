import { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '../lib/api-client';

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

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext(undefined as any);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState(null as any);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('sunflix-token');
        const savedUser = localStorage.getItem('sunflix-user');

        if (token && savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            // Verify token is still valid
            const response = await apiClient.get('/api/auth/me');
            if (response) {
              setUser(response);
            } else {
              // Token invalid, clear storage
              localStorage.removeItem('sunflix-token');
              localStorage.removeItem('sunflix-user');
            }
          } catch (error) {
            localStorage.removeItem('sunflix-token');
            localStorage.removeItem('sunflix-user');
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.post('/api/auth/login', { email, password });
      
      if (response.data.token && response.data.user) {
        const userData = response.data.user;
        
        // Only allow approved regular users
        if (userData.role === 'user' && userData.approved) {
          localStorage.setItem('sunflix-token', response.data.token);
          localStorage.setItem('sunflix-user', JSON.stringify(userData));
          setUser(userData);
          return true;
        } else {
          console.error('User not approved or not a regular user');
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.post('/api/auth/admin-login', { email, password });
      
      if (response.data.token && response.data.user) {
        const userData = response.data.user;
        
        // Only allow admin users
        if (userData.role === 'admin') {
          localStorage.setItem('sunflix-token', response.data.token);
          localStorage.setItem('sunflix-user', JSON.stringify(userData));
          setUser(userData);
          return true;
        } else {
          console.error('User is not an admin');
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.post('/api/auth/signup', {
        name,
        email,
        password,
      });

      if (response.data.token && response.data.user) {
        const userData = response.data.user;
        localStorage.setItem('sunflix-token', response.data.token);
        localStorage.setItem('sunflix-user', JSON.stringify(userData));
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('sunflix-token');
    localStorage.removeItem('sunflix-user');
    setUser(null);
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<void> => {
    try {
      if (!user?.id && !user?._id) return;
      
      const userId = user.id || user._id;
      const response = await apiClient.put(`/api/users/${userId}`, updates);
      
      if (response) {
        const updatedUser = { ...user, ...response };
        setUser(updatedUser);
        localStorage.setItem('sunflix-user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      login,
      adminLogin, 
      signup, 
      logout,
      isAdmin: user?.role === 'admin',
      updateUserProfile
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
