'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  Tag
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { BlogPost } from '@/types/blog';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [tagFilter, setTagFilter] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchQuery, statusFilter, tagFilter]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => 
        statusFilter === 'published' ? post.published : !post.published
      );
    }

    // Tag filter
    if (tagFilter.trim()) {
      filtered = filtered.filter(post =>
        post.tags.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  };

  const togglePostStatus = async (postId: string) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle-published' }),
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(posts.map(post => 
          post.id === postId ? data.post : post
        ));
      }
    } catch (error) {
      console.error('Error toggling post status:', error);
    }
  };

  const handleDeleteClick = (postId: string) => {
    console.log('Delete button clicked for post ID:', postId);
    setPostToDelete(postId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    
    console.log('Delete confirmed for post ID:', postToDelete);
    setShowDeleteConfirm(false);
    
    await deletePost(postToDelete);
    setPostToDelete(null);
  };

  const cancelDelete = () => {
    console.log('Delete cancelled by user');
    setShowDeleteConfirm(false);
    setPostToDelete(null);
  };

  const deletePost = async (postId: string) => {
    console.log('Proceeding with delete request...');
    
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include', // Ensure cookies are sent
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete response status:', response.status);
      console.log('Delete response headers:', response.headers);

      if (response.ok) {
        const result = await response.json();
        console.log('Delete successful:', result);
        
        // Update the posts state to remove the deleted post
        setPosts(prevPosts => {
          const updatedPosts = prevPosts.filter(post => post.id !== postId);
          console.log('Updated posts after deletion:', updatedPosts.length);
          return updatedPosts;
        });
        
        alert('Post deleted successfully!');
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        
        console.error('Delete failed:', errorData);
        
        if (response.status === 401) {
          alert('You are not authorized to delete posts. Please log in again.');
          // Optionally redirect to login
          window.location.href = '/admin/login';
        } else {
          alert(`Failed to delete post: ${errorData.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Network error deleting post:', error);
      alert('Network error occurred while deleting the post. Please check your connection and try again.');
    }
  };

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ice-white mb-2">Blog Posts</h1>
            <p className="text-ice-white/60">Manage your blog content</p>
          </div>
          <a
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 bg-yellow-gradient text-ice-black font-semibold px-6 py-3 rounded-lg hover:scale-105 transition-all duration-300"
          >
            <Plus size={20} />
            New Post
          </a>
        </div>

        {/* Filters */}
        <div className="bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ice-yellow/60" size={18} />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-ice-black/60 border border-ice-yellow/30 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:ring-2 focus:ring-ice-yellow focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-ice-black/60 border border-ice-yellow/30 rounded-lg text-ice-white focus:outline-none focus:ring-2 focus:ring-ice-yellow focus:border-transparent"
            >
              <option value="all">All Posts</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>

            {/* Tag Filter */}
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="px-3 py-2 bg-ice-black/60 border border-ice-yellow/30 rounded-lg text-ice-white focus:outline-none focus:ring-2 focus:ring-ice-yellow focus:border-transparent"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            {/* Results Count */}
            <div className="flex items-center text-ice-white/60">
              <Filter size={18} className="mr-2" />
              {filteredPosts.length} of {posts.length} posts
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-ice-yellow border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-ice-white/60">Loading posts...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="divide-y divide-ice-yellow/10">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="p-6 hover:bg-ice-yellow/5 transition-colors duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-ice-white">{post.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.published 
                            ? 'bg-green-400/10 text-green-400' 
                            : 'bg-orange-400/10 text-orange-400'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      
                      <p className="text-ice-white/70 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-ice-white/60">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(post.date).toLocaleDateString()}
                        </span>
                        {post.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Tag size={14} />
                            <span>{post.tags.slice(0, 2).join(', ')}</span>
                            {post.tags.length > 2 && <span>+{post.tags.length - 2}</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => togglePostStatus(post.id)}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          post.published
                            ? 'text-green-400 hover:bg-green-400/10'
                            : 'text-orange-400 hover:bg-orange-400/10'
                        }`}
                        title={post.published ? 'Unpublish' : 'Publish'}
                      >
                        {post.published ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                      
                      <a
                        href={`/admin/posts/${post.id}`}
                        className="p-2 text-ice-yellow hover:bg-ice-yellow/10 rounded-lg transition-all duration-300"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </a>
                      
                      <button
                        onClick={() => handleDeleteClick(post.id)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-300"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-ice-white/30 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-ice-white mb-2">No posts found</h3>
              <p className="text-ice-white/60 mb-4">
                {searchQuery || statusFilter !== 'all' || tagFilter
                  ? 'Try adjusting your filters or search criteria.'
                  : 'Create your first blog post to get started.'}
              </p>
              <a
                href="/admin/posts/new"
                className="inline-flex items-center gap-2 bg-yellow-gradient text-ice-black font-semibold px-6 py-3 rounded-lg hover:scale-105 transition-all duration-300"
              >
                <Plus size={20} />
                Create First Post
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-ice-black border border-ice-yellow/20 rounded-xl p-6 max-w-md mx-4"
          >
            <div className="text-center">
              <div className="text-red-400 text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-ice-white mb-2">
                Delete Post
              </h3>
              <p className="text-ice-white/70 mb-6">
                Are you sure you want to delete this post? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-ice-white/10 text-ice-white rounded-lg hover:bg-ice-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
