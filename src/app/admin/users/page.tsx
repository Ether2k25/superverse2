'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Shield, User, Mail, Calendar } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = (Array.isArray(users) ? users : []).filter((user: any) =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ice-white">Users</h1>
            <p className="text-ice-white/60">Manage admin users and permissions</p>
          </div>

          <button className="inline-flex items-center gap-2 bg-yellow-gradient text-ice-black font-semibold px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300">
            <Plus size={18} />
            Add User
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ice-white/40" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-3 bg-ice-black/60 border border-ice-yellow/30 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:ring-2 focus:ring-ice-yellow focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ice-yellow mx-auto"></div>
              <p className="text-ice-white/60 mt-4">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <User className="mx-auto h-12 w-12 text-ice-white/40 mb-4" />
              <p className="text-ice-white/60">No users found</p>
            </div>
          ) : (
            <div className="divide-y divide-ice-yellow/10">
              {filteredUsers.map((user: any, index: number) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-ice-yellow/5 transition-colors duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-ice-yellow/10 rounded-full flex items-center justify-center">
                        <User className="text-ice-yellow" size={20} />
                      </div>
                      
                      <div>
                        <h3 className="text-ice-white font-semibold">{user.username}</h3>
                        <div className="flex items-center gap-4 text-sm text-ice-white/60">
                          <span className="flex items-center gap-1">
                            <Mail size={14} />
                            {user.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Shield size={14} />
                            {user.role}
                          </span>
                          {user.lastLogin && (
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              Last login: {new Date(user.lastLogin).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="p-2 text-ice-white/60 hover:text-ice-yellow transition-colors duration-300">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-ice-white/60 hover:text-red-400 transition-colors duration-300">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
