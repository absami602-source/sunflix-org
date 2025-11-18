import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, MessageCircle, User, Search, Menu, X, Lock, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageModal } from './MessageModal';
import { NotificationBell } from './NotificationBell';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLoginClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
              <Sparkles className="w-8 h-8 text-[#FFB800] relative z-10" />
            </motion.div>
            <div className="text-3xl font-black bg-gradient-to-r from-[#FF7E00] via-[#C85FFF] to-[#6C00FF] bg-clip-text text-transparent transition-all group-hover:scale-105">
              SUNFLIX
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-12">
            <div className="relative w-full group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity" />
              <Input
                type="text"
                placeholder="Search for videos, creators, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1A1A1D]/50 border border-white/10 focus:border-[#FFB800] rounded-full pl-5 pr-14 h-12 transition-all relative z-10 backdrop-blur-sm"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] hover:opacity-90 h-8 w-8 p-0"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hover:bg-[#1A1A1D] transition-all hover:text-[#FFB800] rounded-full relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity" />
                {theme === 'dark' ? <Sun className="w-5 h-5 relative z-10" /> : <Moon className="w-5 h-5 relative z-10" />}
              </Button>
            </motion.div>

            {/* Messages */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMessageModalOpen(true)}
                className="hover:bg-[#1A1A1D] transition-all hover:text-[#FFB800] rounded-full relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity" />
                <MessageCircle className="w-5 h-5 relative z-10" />
              </Button>
            </motion.div>

            {/* Notifications */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <NotificationBell />
            </motion.div>

            {/* Profile / Login */}
            {user ? (
              <div className="flex items-center space-x-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/profile')}
                    className="hover:bg-[#1A1A1D] transition-all rounded-full px-4 relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity" />
                    <User className="w-5 h-5 mr-2 relative z-10" />
                    <span className="relative z-10">{user.name}</span>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-[#FF7E00]" 
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </motion.div>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleLoginClick}
                  className="bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] hover:opacity-90 transition-all rounded-full px-6 relative group shadow-lg shadow-[#FF7E00]/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] rounded-full blur opacity-50 group-hover:opacity-100 transition-opacity" />
                  <User className="w-5 h-5 mr-2 relative z-10" />
                  <span className="relative z-10">Login</span>
                </Button>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#1A1A1D]/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              <form onSubmit={handleSearch}>
                <Input
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0E0E10] border-white/10 rounded-full"
                />
              </form>
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={toggleTheme} className="rounded-full">
                  {theme === 'dark' ? <Sun className="w-5 h-5 mr-2" /> : <Moon className="w-5 h-5 mr-2" />}
                  Theme
                </Button>
                <Button variant="ghost" onClick={() => setMessageModalOpen(true)} className="rounded-full">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Messages
                </Button>
              </div>
              {user?.role === 'admin' && (
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-full"
                  onClick={() => {
                    navigate('/admin');
                    setMobileMenuOpen(false);
                  }}
                >
                  <Lock className="w-5 h-5 mr-2" />
                  Admin Panel
                </Button>
              )}
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-full"
                    onClick={() => navigate('/profile')}
                  >
                    <User className="w-5 h-5 mr-2" />
                    {user.name}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-full border-[#FF7E00]" 
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] rounded-full"
                  onClick={handleLoginClick}
                >
                  Login
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Modal */}
      <MessageModal open={messageModalOpen} onOpenChange={setMessageModalOpen} />
    </motion.nav>
  );
}