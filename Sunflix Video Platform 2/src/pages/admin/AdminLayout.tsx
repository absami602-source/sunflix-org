import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Video, MessageSquare, Settings, Users, LogOut, Sparkles, ChevronRight, DollarSign } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

export function AdminLayout() {
  const { isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if we're sure the user is loaded and is not an admin
    if (user !== null && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate, user]);

  // Don't show anything while checking if user is admin
  if (!isAdmin) {
    return null;
  }

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { to: '/admin/videos', icon: Video, label: 'Manage Videos' },
    { to: '/admin/add-video', icon: Video, label: 'Add Video' },
    { to: '/admin/ads', icon: DollarSign, label: 'Ads & Monetization' },
    { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path) && location.pathname !== '/admin';
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-background via-[#1A1A1D] to-background">
      <div className="flex">
        {/* Premium Sidebar */}
        <motion.aside 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-72 min-h-[calc(100vh-5rem)] bg-gradient-to-b from-card to-background border-r border-border p-6 backdrop-blur-xl shadow-2xl"
        >
          {/* Admin Header */}
          <div className="mb-8 p-4 rounded-2xl bg-gradient-to-br from-[#FF7E00]/20 to-[#6C00FF]/20 border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] blur-lg opacity-50" />
                <Sparkles className="w-8 h-8 text-[#FFB800] relative z-10" />
              </div>
              <div>
                <h2 className="text-xl bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] bg-clip-text text-transparent">
                  Admin Panel
                </h2>
                <p className="text-xs text-muted-foreground">Welcome back, {user?.name}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = isActive(item.to, item.exact);
              return (
                <Link key={item.to} to={item.to}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-between group relative overflow-hidden transition-all duration-300 ${
                        active
                          ? 'bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] text-white shadow-lg shadow-[#FF7E00]/50'
                          : 'hover:bg-card text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-[#FF7E00] to-[#6C00FF]"
                          transition={{ type: 'spring', duration: 0.6 }}
                        />
                      )}
                      <div className="flex items-center gap-3 relative z-10">
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform relative z-10 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                    </Button>
                  </motion.div>
                </Link>
              );
            })}

            <motion.div
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="pt-4"
            >
              <Button
                variant="ghost"
                className="w-full justify-start text-[#FF1744] hover:bg-[#FF1744]/10 hover:text-[#FF1744] transition-all group"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </Button>
            </motion.div>
          </nav>

          {/* Bottom decoration */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#FF7E00]/10 to-[#6C00FF]/10 border border-border">
              <p className="text-xs text-muted-foreground text-center">
                Powered by SUNFLIX
              </p>
              <div className="h-1 w-full bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] rounded-full mt-2" />
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}