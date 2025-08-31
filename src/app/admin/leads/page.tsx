'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Search, 
  Filter, 
  Trash2, 
  Users, 
  MessageCircle, 
  Mail, 
  Phone,
  Calendar,
  FileText,
  BarChart3,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: 'comment' | 'newsletter' | 'contact';
  postId?: string;
  postTitle?: string;
  commentId?: string;
  createdAt: string;
  expiresAt: string;
}

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Load leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('/api/admin/leads');
        const data = await response.json();
        setLeads(data.leads || []);
        setFilteredLeads(data.leads || []);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Filter leads
  useEffect(() => {
    let filtered = leads;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.postTitle && lead.postTitle.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(lead => lead.source === sourceFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(lead => {
        const leadDate = new Date(lead.createdAt);
        const leadDateOnly = new Date(leadDate.getFullYear(), leadDate.getMonth(), leadDate.getDate());
        
        switch (dateFilter) {
          case 'today':
            return leadDateOnly.getTime() === today.getTime();
          case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return leadDateOnly.getTime() === yesterday.getTime();
          case 'last7days':
            const last7Days = new Date(today);
            last7Days.setDate(last7Days.getDate() - 7);
            return leadDateOnly >= last7Days;
          case 'last30days':
            const last30Days = new Date(today);
            last30Days.setDate(last30Days.getDate() - 30);
            return leadDateOnly >= last30Days;
          case 'custom':
            if (customStartDate && customEndDate) {
              const startDate = new Date(customStartDate);
              const endDate = new Date(customEndDate);
              return leadDateOnly >= startDate && leadDateOnly <= endDate;
            }
            return true;
          default:
            return true;
        }
      });
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm, sourceFilter, dateFilter, customStartDate, customEndDate]);

  // Export leads
  const handleExport = async (format: 'csv' | 'json') => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      params.append('format', format);
      if (sourceFilter !== 'all') {
        params.append('source', sourceFilter);
      }

      const response = await fetch(`/api/admin/leads/export?${params}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads_${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting leads:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Delete lead
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const response = await fetch(`/api/admin/leads?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setLeads(leads.filter(lead => lead.id !== id));
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  // Get source icon
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'comment':
        return <MessageCircle size={16} className="text-blue-400" />;
      case 'newsletter':
        return <Mail size={16} className="text-green-400" />;
      case 'contact':
        return <Phone size={16} className="text-purple-400" />;
      default:
        return <Users size={16} className="text-gray-400" />;
    }
  };

  // Get statistics
  const stats = {
    total: leads.length,
    comment: leads.filter(l => l.source === 'comment').length,
    newsletter: leads.filter(l => l.source === 'newsletter').length,
    contact: leads.filter(l => l.source === 'contact').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ice-black p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-ice-yellow/20 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-ice-yellow/20 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-ice-yellow/20 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ice-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-ice-white mb-2">Lead Management</h1>
              <p className="text-ice-white/60">Manage and export your captured leads</p>
            </div>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 bg-ice-yellow/10 border border-ice-yellow/20 text-ice-yellow px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-ice-yellow/20 hover:scale-105"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-ice-black/60 border border-ice-yellow/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ice-white/60 text-sm">Total Leads</p>
                <p className="text-2xl font-bold text-ice-white">{stats.total}</p>
              </div>
              <Users className="text-ice-yellow" size={24} />
            </div>
          </div>

          <div className="bg-ice-black/60 border border-ice-yellow/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ice-white/60 text-sm">From Comments</p>
                <p className="text-2xl font-bold text-ice-white">{stats.comment}</p>
              </div>
              <MessageCircle className="text-blue-400" size={24} />
            </div>
          </div>

          <div className="bg-ice-black/60 border border-ice-yellow/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ice-white/60 text-sm">Newsletter</p>
                <p className="text-2xl font-bold text-ice-white">{stats.newsletter}</p>
              </div>
              <Mail className="text-green-400" size={24} />
            </div>
          </div>

          <div className="bg-ice-black/60 border border-ice-yellow/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ice-white/60 text-sm">Contact Form</p>
                <p className="text-2xl font-bold text-ice-white">{stats.contact}</p>
              </div>
              <Phone className="text-purple-400" size={24} />
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-ice-black/60 border border-ice-yellow/20 rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ice-white/40" size={20} />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-ice-black/40 border border-ice-yellow/30 rounded-lg text-ice-white placeholder-ice-white/50 focus:border-ice-yellow focus:outline-none"
                />
              </div>

              {/* Source Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ice-white/40" size={20} />
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-ice-black/40 border border-ice-yellow/30 rounded-lg text-ice-white focus:border-ice-yellow focus:outline-none appearance-none"
                >
                  <option value="all">All Sources</option>
                  <option value="comment">Comments</option>
                  <option value="newsletter">Newsletter</option>
                  <option value="contact">Contact Form</option>
                </select>
              </div>

              {/* Date Filter */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ice-white/40" size={20} />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-ice-black/40 border border-ice-yellow/30 rounded-lg text-ice-white focus:border-ice-yellow focus:outline-none appearance-none"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              {/* Custom Date Range */}
              {dateFilter === 'custom' && (
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="px-3 py-2 bg-ice-black/40 border border-ice-yellow/30 rounded-lg text-ice-white focus:border-ice-yellow focus:outline-none"
                    placeholder="Start Date"
                  />
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="px-3 py-2 bg-ice-black/40 border border-ice-yellow/30 rounded-lg text-ice-white focus:border-ice-yellow focus:outline-none"
                    placeholder="End Date"
                  />
                </div>
              )}
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('csv')}
                disabled={isExporting || filteredLeads.length === 0}
                className="inline-flex items-center gap-2 bg-ice-yellow text-ice-black px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-ice-gold hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} />
                Export CSV
              </button>
              
              <button
                onClick={() => handleExport('json')}
                disabled={isExporting || filteredLeads.length === 0}
                className="inline-flex items-center gap-2 bg-ice-white text-ice-black px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-gray-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText size={16} />
                Export JSON
              </button>
            </div>
          </div>
        </motion.div>

        {/* Leads Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-ice-black/60 border border-ice-yellow/20 rounded-xl overflow-hidden"
        >
          {filteredLeads.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="text-ice-yellow/50 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-ice-white mb-2">No leads found</h3>
              <p className="text-ice-white/60">
                {leads.length === 0 ? 'No leads have been captured yet.' : 'Try adjusting your search or filters.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-ice-yellow/10 border-b border-ice-yellow/20">
                  <tr>
                    <th className="text-left p-4 text-ice-white font-semibold">Name</th>
                    <th className="text-left p-4 text-ice-white font-semibold">Email</th>
                    <th className="text-left p-4 text-ice-white font-semibold">Phone</th>
                    <th className="text-left p-4 text-ice-white font-semibold">Source</th>
                    <th className="text-left p-4 text-ice-white font-semibold">Post</th>
                    <th className="text-left p-4 text-ice-white font-semibold">Created</th>
                    <th className="text-left p-4 text-ice-white font-semibold">Expires</th>
                    <th className="text-left p-4 text-ice-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, index) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-ice-yellow/10 hover:bg-ice-yellow/5 transition-colors"
                    >
                      <td className="p-4 text-ice-white">{lead.name}</td>
                      <td className="p-4 text-ice-white/80">{lead.email}</td>
                      <td className="p-4 text-ice-white/80">{lead.phone || '-'}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getSourceIcon(lead.source)}
                          <span className="text-ice-white/80 capitalize">{lead.source}</span>
                        </div>
                      </td>
                      <td className="p-4 text-ice-white/80 max-w-xs truncate">
                        {lead.postTitle || '-'}
                      </td>
                      <td className="p-4 text-ice-white/60 text-sm">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-ice-white/60 text-sm">
                        {new Date(lead.expiresAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1"
                          title="Delete lead"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Results Info */}
        {filteredLeads.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-center text-ice-white/60 text-sm"
          >
            Showing {filteredLeads.length} of {leads.length} leads
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LeadsPage;
