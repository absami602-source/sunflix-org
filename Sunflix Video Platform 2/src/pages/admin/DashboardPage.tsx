import React, { useEffect, useState } from 'react';
import { Video, Eye, Users, MessageSquare, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
// API calls replace storage.ts functions - see code below
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import apiClient from '../../lib/api-client';

export function DashboardPage() {
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalUsers: 0,
    totalMessages: 0,
  });

  const [viewsData, setViewsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all data from API
        const [videosRes, usersRes, messagesRes] = await Promise.all([
          apiClient.get('/api/videos'),
          apiClient.get('/api/users'),
          apiClient.get('/api/messages')
        ]);

        const videos = videosRes.data;
        const users = usersRes.data;
        const messages = messagesRes.data;

        const totalViews = videos.reduce((sum: number, video: any) => sum + (video.views ?? 0), 0);

        setStats({
          totalVideos: videos.length,
          totalViews,
          totalUsers: users.length,
          totalMessages: messages.filter((m: any) => !m.read).length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();

    // Generate mock data for views chart
    const mockData = [
      { name: 'Mon', views: 4000 },
      { name: 'Tue', views: 3000 },
      { name: 'Wed', views: 5000 },
      { name: 'Thu', views: 2780 },
      { name: 'Fri', views: 6890 },
      { name: 'Sat', views: 8390 },
      { name: 'Sun', views: 9490 },
    ];
    setViewsData(mockData);
  }, []);

  const statCards = [
    {
      title: 'Total Videos',
      value: stats.totalVideos,
      icon: Video,
      gradient: 'from-[#FF7E00] to-[#FFB800]',
      bgGradient: 'from-[#FF7E00]/10 to-[#FFB800]/10',
      change: '+12%',
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      gradient: 'from-[#6C00FF] to-[#8B3FFF]',
      bgGradient: 'from-[#6C00FF]/10 to-[#8B3FFF]/10',
      change: '+23%',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      gradient: 'from-[#FF7E00] to-[#6C00FF]',
      bgGradient: 'from-[#FF7E00]/10 to-[#6C00FF]/10',
      change: '+8%',
    },
    {
      title: 'Unread Messages',
      value: stats.totalMessages,
      icon: MessageSquare,
      gradient: 'from-[#FFB800] to-[#FF7E00]',
      bgGradient: 'from-[#FFB800]/10 to-[#FF7E00]/10',
      change: '+5',
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl text-white mb-2 bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-[#A0A0A0]">Welcome back! Here's what's happening with your platform.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`bg-gradient-to-br ${stat.bgGradient} border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden group`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-[#A0A0A0]">{stat.title}</CardTitle>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl text-white mb-2">{stat.value}</div>
                <div className="flex items-center text-sm">
                  <span className="text-[#00E676] flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change}
                  </span>
                  <span className="text-[#A0A0A0] ml-2">vs last week</span>
                </div>
              </CardContent>
              <div className={`h-1 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Views Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-[#1A1A1D] to-[#0E0E10] border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#FF7E00] to-[#6C00FF]">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Views Over Time</CardTitle>
                    <p className="text-sm text-[#A0A0A0]">Last 7 days</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={viewsData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF7E00" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6C00FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#A0A0A0" />
                  <YAxis stroke="#A0A0A0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1A1A1D',
                      border: '1px solid #ffffff20',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="url(#colorGradient)"
                    strokeWidth={3}
                    fill="url(#colorViews)"
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#FF7E00" />
                      <stop offset="100%" stopColor="#6C00FF" />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-[#1A1A1D] to-[#0E0E10] border-white/10 h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#FFB800] to-[#FF7E00]">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">Quick Insights</CardTitle>
                  <p className="text-sm text-[#A0A0A0]">Performance metrics</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Most Viewed Video', value: 'Epic Gaming Moments', views: '250K views' },
                { label: 'Top Category', value: 'Gaming', percentage: '35%' },
                { label: 'Avg. Watch Time', value: '8:42', change: '+2:15' },
                { label: 'Engagement Rate', value: '68%', change: '+5%' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-[#FF7E00]/10 to-[#6C00FF]/10 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#A0A0A0] mb-1">{item.label}</p>
                      <p className="text-white">{item.value}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#FFB800]">{item.views || item.percentage || item.change}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-gradient-to-br from-[#1A1A1D] to-[#0E0E10] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New video published', title: 'Amazing Tech Review 2025', time: '2 hours ago', color: 'from-[#FF7E00] to-[#FFB800]' },
                { action: 'User registered', title: 'john@example.com', time: '4 hours ago', color: 'from-[#6C00FF] to-[#8B3FFF]' },
                { action: 'New message received', title: 'Contact form submission', time: '6 hours ago', color: 'from-[#FFB800] to-[#FF7E00]' },
                { action: 'Video reached milestone', title: '100K views on Gaming Compilation', time: '8 hours ago', color: 'from-[#FF7E00] to-[#6C00FF]' },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-[#FF7E00]/5 to-[#6C00FF]/5 border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${activity.color}`} />
                  <div className="flex-1">
                    <p className="text-white">{activity.action}</p>
                    <p className="text-sm text-[#A0A0A0]">{activity.title}</p>
                  </div>
                  <span className="text-xs text-[#A0A0A0]">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}