import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getUserNotifications, markNotificationAsRead as apiMarkNotificationAsRead } from '../lib/mongodb-storage';
import type { Notification } from '../lib/mongodb-storage';
import { useNavigate } from 'react-router-dom';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

export function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    const userNotifications = await getUserNotifications(user.id);
    setNotifications(userNotifications || []);
    setUnreadCount((userNotifications || []).filter(n => !n.read).length);
  };

  const handleNotificationClick = async (notification: Notification) => {
    await apiMarkNotificationAsRead(notification.id);
    await loadNotifications();
    if (notification.link) {
      navigate(notification.link);
    }
    setIsOpen(false);
  };

  const handleMarkAllRead = async () => {
    if (user) {
      // mark each unread notification as read via API
      const unread = notifications.filter(n => !n.read);
      await Promise.all(unread.map(n => apiMarkNotificationAsRead(n.id)));
      await loadNotifications();
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return '👍';
      case 'comment': return '💬';
      case 'reply': return '↩️';
      case 'video': return '🎥';
      case 'system': return '🔔';
      default: return '📬';
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:text-[#FFB800] transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#FF7E00] to-[#FFB800] rounded-full flex items-center justify-center text-xs text-white"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Notification Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 top-full mt-2 w-96 bg-[#1A1A1D] border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllRead}
                    className="text-xs text-[#FFB800] hover:text-[#FFB800]/80"
                  >
                    Mark all read
                  </Button>
                )}
              </div>

              {/* Notifications List */}
              <ScrollArea className="h-[400px]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-[#A0A0A0]">
                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {notifications.map(notification => (
                      <motion.div
                        key={notification.id}
                        whileHover={{ backgroundColor: 'rgba(255, 126, 0, 0.05)' }}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-[#FF7E00]/10' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="text-2xl flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`text-sm ${!notification.read ? 'text-white' : 'text-[#A0A0A0]'}`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 rounded-full bg-[#FFB800] flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-xs text-[#A0A0A0] mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-[#FF7E00] mt-1">
                              {getTimeSince(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
