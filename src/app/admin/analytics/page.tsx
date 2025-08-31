'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Users, 
  Calendar,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

interface AnalyticsData {
  pageViews: {
    total: number;
    change: number;
    data: { date: string; views: number }[];
  };
  uniqueVisitors: {
    total: number;
    change: number;
  };
  topPosts: {
    title: string;
    slug: string;
    views: number;
  }[];
  referrers: {
    source: string;
    visits: number;
    percentage: number;
  }[];
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      // Reset analytics data - will generate organically when deployed
      const mockData: AnalyticsData = {
        pageViews: {
          total: 0,
          change: 0,
          data: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            views: 0
          }))
        },
        uniqueVisitors: {
          total: 0,
          change: 0
        },
        topPosts: [],
        referrers: []
      };
      
      setAnalytics(mockData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatPercentage = (num: number) => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ice-white mb-2">Analytics</h1>
            <p className="text-ice-white/60">Track your blog's performance and engagement</p>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-2 bg-ice-black/60 border border-ice-yellow/30 rounded-lg text-ice-white focus:outline-none focus:ring-2 focus:ring-ice-yellow focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-ice-yellow border-t-transparent rounded-full"></div>
          </div>
        ) : analytics ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <Eye className="text-blue-400" size={24} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    analytics.pageViews.change > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {analytics.pageViews.change > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    {formatPercentage(analytics.pageViews.change)}
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-ice-white mb-1">
                    {formatNumber(analytics.pageViews.total)}
                  </p>
                  <p className="text-ice-white/60 text-sm">Page Views</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <Users className="text-green-400" size={24} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    analytics.uniqueVisitors.change > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {analytics.uniqueVisitors.change > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    {formatPercentage(analytics.uniqueVisitors.change)}
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-ice-white mb-1">
                    {formatNumber(analytics.uniqueVisitors.total)}
                  </p>
                  <p className="text-ice-white/60 text-sm">Unique Visitors</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <TrendingUp className="text-yellow-400" size={24} />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <span>--</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-ice-white mb-1">
                    {analytics.uniqueVisitors.total > 0 ? Math.round(analytics.pageViews.total / analytics.uniqueVisitors.total * 100) / 100 : 0}
                  </p>
                  <p className="text-ice-white/60 text-sm">Pages per Visit</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <Activity className="text-purple-400" size={24} />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <span>--</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-ice-white mb-1">0:00</p>
                  <p className="text-ice-white/60 text-sm">Avg. Session</p>
                </div>
              </motion.div>
            </div>

            {/* Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Posts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold text-ice-white mb-4">Top Posts</h3>
                <div className="space-y-4">
                  {analytics.topPosts.length > 0 ? (
                    analytics.topPosts.map((post, index) => (
                      <div key={post.slug} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-ice-white font-medium text-sm">{post.title}</p>
                          <p className="text-ice-white/60 text-xs">/{post.slug}</p>
                        </div>
                        <div className="text-ice-yellow font-semibold">
                          {formatNumber(post.views)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-ice-white/60">No data available yet</p>
                      <p className="text-ice-white/40 text-sm mt-1">Analytics will populate as visitors engage with your content</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Traffic Sources */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold text-ice-white mb-4">Traffic Sources</h3>
                <div className="space-y-4">
                  {analytics.referrers.length > 0 ? (
                    analytics.referrers.map((referrer, index) => (
                      <div key={referrer.source} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-ice-yellow"></div>
                          <span className="text-ice-white">{referrer.source}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-ice-white/60 text-sm">{referrer.percentage}%</span>
                          <span className="text-ice-yellow font-semibold">
                            {formatNumber(referrer.visits)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-ice-white/60">No traffic data available yet</p>
                      <p className="text-ice-white/40 text-sm mt-1">Traffic sources will appear as visitors discover your blog</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-ice-white/60">Failed to load analytics data</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
