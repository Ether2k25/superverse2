'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  FileText, 
  Eye, 
  Users, 
  Image, 
  Plus,
  TrendingUp,
  Calendar,
  Settings
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { AdminStats } from '@/types/admin';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const statCards = [
    {
      title: 'Total Posts',
      value: stats?.totalPosts || 0,
      icon: FileText,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      change: '+2 this week',
    },
    {
      title: 'Published',
      value: stats?.publishedPosts || 0,
      icon: Eye,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      change: `${stats?.draftPosts || 0} drafts`,
    },
    {
      title: 'Total Views',
      value: stats?.totalViews || 0,
      icon: TrendingUp,
      color: 'text-ice-yellow',
      bgColor: 'bg-ice-yellow/10',
      change: '+15% this month',
    },
    {
      title: 'Media Files',
      value: stats?.totalFiles || 0,
      icon: Image,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      change: formatBytes(stats?.storageUsed || 0),
    },
  ];

  const quickActions = [
    {
      title: 'New Blog Post',
      description: 'Create a new blog post',
      icon: Plus,
      href: '/admin/posts/new',
      color: 'bg-ice-yellow text-ice-black',
    },
    {
      title: 'Upload Media',
      description: 'Upload images and files',
      icon: Image,
      href: '/admin/media',
      color: 'bg-blue-500 text-white',
    },
    {
      title: 'View Analytics',
      description: 'Check site performance',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-green-500 text-white',
    },
    {
      title: 'Settings',
      description: 'Manage site settings',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-purple-500 text-white',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-ice-white mb-2">Dashboard</h1>
          <p className="text-ice-white/60">Welcome back! Here's what's happening with your blog.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl p-6 hover:border-ice-yellow/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`${stat.color}`} size={24} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-ice-white">{stat.value.toLocaleString()}</p>
                  <p className="text-ice-white/60 text-sm">{stat.title}</p>
                </div>
              </div>
              <p className="text-ice-white/50 text-xs">{stat.change}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-ice-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.a
                key={action.title}
                href={action.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="block bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl p-6 hover:border-ice-yellow/40 hover:scale-105 transition-all duration-300 group"
              >
                <div className={`inline-flex p-3 rounded-lg ${action.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-ice-white mb-2">{action.title}</h3>
                <p className="text-ice-white/60 text-sm">{action.description}</p>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-ice-white">Recent Posts</h2>
            <a
              href="/admin/posts"
              className="text-ice-yellow hover:text-ice-gold text-sm transition-colors duration-300"
            >
              View all posts →
            </a>
          </div>
          
          <div className="bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-ice-yellow border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-ice-white/60">Loading recent posts...</p>
              </div>
            ) : stats?.recentPosts && stats.recentPosts.length > 0 ? (
              <div className="divide-y divide-ice-yellow/10">
                {stats.recentPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="p-4 hover:bg-ice-yellow/5 transition-colors duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-ice-white font-medium mb-1">{post.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-ice-white/60">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(post.date).toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            post.published 
                              ? 'bg-green-400/10 text-green-400' 
                              : 'bg-orange-400/10 text-orange-400'
                          }`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                      <a
                        href={`/admin/posts/${post.id}`}
                        className="text-ice-yellow hover:text-ice-gold transition-colors duration-300"
                      >
                        Edit →
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 text-ice-white/30 mx-auto mb-4" />
                <p className="text-ice-white/60">No posts yet. Create your first post!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
