'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Megaphone, 
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import Link from 'next/link';

interface Announcement {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    message: '',
    type: 'info' as 'info' | 'warning' | 'success'
  });

  // Load announcements
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements');
      const data = await response.json();
      setAnnouncements(data.announcements || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchAnnouncements();
        setFormData({ message: '', type: 'info' });
        setShowForm(false);
        setEditingId(null);
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const response = await fetch(`/api/announcements?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchAnnouncements();
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      message: announcement.message,
      type: announcement.type
    });
    setEditingId(announcement.id);
    setShowForm(true);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        await fetchAnnouncements();
      }
    } catch (error) {
      console.error('Error toggling announcement:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    if (!type) return <Info className="text-blue-400" size={20} />;
    switch (type) {
      case 'warning': return <AlertCircle className="text-orange-400" size={20} />;
      case 'success': return <CheckCircle className="text-green-400" size={20} />;
      default: return <Info className="text-blue-400" size={20} />;
    }
  };

  const getTypeBadge = (type: string) => {
    if (!type) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    const colors = {
      info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      warning: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      success: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ice-black p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-ice-yellow/20 rounded w-1/4"></div>
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
              <h1 className="text-3xl font-bold text-ice-white mb-2">Announcements</h1>
              <p className="text-ice-white/60">Manage site-wide announcements and messages</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setFormData({ message: '', type: 'info' });
                  setEditingId(null);
                  setShowForm(!showForm);
                }}
                className="inline-flex items-center gap-2 bg-ice-yellow text-ice-black px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-ice-gold hover:scale-105"
              >
                <Plus size={16} />
                New Announcement
              </button>
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-2 bg-ice-yellow/10 border border-ice-yellow/20 text-ice-yellow px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-ice-yellow/20 hover:scale-105"
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Create/Edit Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-ice-black/60 border border-ice-yellow/20 rounded-xl p-6 mb-8"
          >
            <h2 className="text-xl font-bold text-ice-white mb-4">
              {editingId ? 'Edit Announcement' : 'Create New Announcement'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-ice-white text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-ice-black border border-ice-yellow/20 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:border-ice-yellow resize-none"
                  rows={3}
                  placeholder="Enter your announcement message..."
                  required
                />
              </div>
              <div>
                <label className="block text-ice-white text-sm font-medium mb-2">
                  Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label className={`cursor-pointer border-2 rounded-lg p-3 transition-all duration-300 ${
                    formData.type === 'info' 
                      ? 'border-blue-500 bg-blue-500/20' 
                      : 'border-blue-500/30 hover:border-blue-500/50'
                  }`}>
                    <input
                      type="radio"
                      name="type"
                      value="info"
                      checked={formData.type === 'info'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'info' | 'warning' | 'success' })}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-2">
                      <Info className="text-blue-400" size={16} />
                      <span className="text-blue-400 font-medium">Info</span>
                    </div>
                    <div className="mt-1 text-xs text-blue-300">Blue banner</div>
                  </label>
                  
                  <label className={`cursor-pointer border-2 rounded-lg p-3 transition-all duration-300 ${
                    formData.type === 'warning' 
                      ? 'border-red-500 bg-red-500/20' 
                      : 'border-red-500/30 hover:border-red-500/50'
                  }`}>
                    <input
                      type="radio"
                      name="type"
                      value="warning"
                      checked={formData.type === 'warning'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'info' | 'warning' | 'success' })}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="text-red-400" size={16} />
                      <span className="text-red-400 font-medium">Warning</span>
                    </div>
                    <div className="mt-1 text-xs text-red-300">Red banner</div>
                  </label>
                  
                  <label className={`cursor-pointer border-2 rounded-lg p-3 transition-all duration-300 ${
                    formData.type === 'success' 
                      ? 'border-green-500 bg-green-500/20' 
                      : 'border-green-500/30 hover:border-green-500/50'
                  }`}>
                    <input
                      type="radio"
                      name="type"
                      value="success"
                      checked={formData.type === 'success'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'info' | 'warning' | 'success' })}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="text-green-400" size={16} />
                      <span className="text-green-400 font-medium">Success</span>
                    </div>
                    <div className="mt-1 text-xs text-green-300">Green banner</div>
                  </label>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-ice-yellow text-ice-black px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-ice-gold"
                >
                  {editingId ? 'Update' : 'Create'} Announcement
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ message: '', type: 'info' });
                  }}
                  className="bg-ice-white/10 text-ice-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-ice-white/20"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Announcements List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-ice-black/60 border border-ice-yellow/20 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Megaphone className="text-ice-yellow" size={24} />
            <h2 className="text-xl font-bold text-ice-white">All Announcements</h2>
          </div>

          {announcements.length === 0 ? (
            <div className="text-center py-12">
              <Megaphone className="text-ice-white/30 mx-auto mb-4" size={48} />
              <p className="text-ice-white/60 text-lg">No announcements yet</p>
              <p className="text-ice-white/40 text-sm">Create your first announcement to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`border rounded-lg p-4 transition-all duration-300 ${
                    announcement.isActive 
                      ? 'border-ice-yellow/40 bg-ice-yellow/5' 
                      : 'border-ice-white/20 bg-ice-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getTypeIcon(announcement.type)}
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getTypeBadge(announcement.type)}`}>
                          {announcement.type?.toUpperCase() || 'INFO'}
                        </span>
                        {announcement.isActive && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-ice-yellow/20 text-ice-yellow border border-ice-yellow/30">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-ice-white mb-2">{announcement.message}</p>
                      <p className="text-ice-white/40 text-sm">
                        Created: {new Date(announcement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleToggleActive(announcement.id, !announcement.isActive)}
                        className={`p-2 rounded-lg transition-colors duration-300 ${
                          announcement.isActive
                            ? 'text-orange-400 hover:bg-orange-400/10'
                            : 'text-green-400 hover:bg-green-400/10'
                        }`}
                        title={announcement.isActive ? 'Deactivate announcement' : 'Activate announcement'}
                      >
                        {announcement.isActive ? '⏸️' : '▶️'}
                      </button>
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="p-2 text-ice-blue hover:bg-ice-blue/10 rounded-lg transition-colors duration-300"
                        title="Edit announcement"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors duration-300"
                        title="Delete announcement"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
