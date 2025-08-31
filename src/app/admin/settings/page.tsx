'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, Mail, Shield, Database, Bell } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'ICE SUPER Blog',
    siteDescription: 'Casino Tech, Affiliate Growth & the Future of iGaming',
    siteUrl: 'http://localhost:3002',
    adminEmail: 'admin@icesuper.com',
    allowRegistration: false,
    maintenanceMode: false,
    maxFileSize: 10,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-ice-white">Settings</h1>
          <p className="text-ice-white/60">Configure your blog settings and preferences</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Site Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl p-6"
          >
            <h2 className="flex items-center gap-2 text-xl font-semibold text-ice-white mb-6">
              <Globe size={20} />
              Site Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-ice-white font-medium mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                  className="w-full px-4 py-3 bg-ice-black/60 border border-ice-yellow/30 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:ring-2 focus:ring-ice-yellow focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-ice-white font-medium mb-2">
                  Site URL
                </label>
                <input
                  type="url"
                  value={settings.siteUrl}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
                  className="w-full px-4 py-3 bg-ice-black/60 border border-ice-yellow/30 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:ring-2 focus:ring-ice-yellow focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-ice-white font-medium mb-2">
                  Site Description
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                  className="w-full px-4 py-3 bg-ice-black/60 border border-ice-yellow/30 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:ring-2 focus:ring-ice-yellow focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            </div>
          </motion.div>

          {/* Admin Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl p-6"
          >
            <h2 className="flex items-center gap-2 text-xl font-semibold text-ice-white mb-6">
              <Shield size={20} />
              Admin Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-ice-white font-medium mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => setSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
                  className="w-full px-4 py-3 bg-ice-black/60 border border-ice-yellow/30 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:ring-2 focus:ring-ice-yellow focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-ice-white font-medium mb-2">
                  Max File Size (MB)
                </label>
                <input
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 bg-ice-black/60 border border-ice-yellow/30 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:ring-2 focus:ring-ice-yellow focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-ice-white font-medium">Allow User Registration</h3>
                    <p className="text-ice-white/60 text-sm">Allow new users to register for admin access</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings(prev => ({ ...prev, allowRegistration: !prev.allowRegistration }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.allowRegistration ? 'bg-ice-yellow' : 'bg-ice-white/20'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.allowRegistration ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-ice-white font-medium">Maintenance Mode</h3>
                    <p className="text-ice-white/60 text-sm">Put the site in maintenance mode</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.maintenanceMode ? 'bg-red-500' : 'bg-ice-white/20'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 bg-yellow-gradient text-ice-black font-semibold px-6 py-3 rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
