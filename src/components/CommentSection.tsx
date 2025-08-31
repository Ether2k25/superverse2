'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, User, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface Comment {
  id: string;
  postId: string;
  content: string;
  author: {
    name: string;
    email?: string;
    isAnonymous: boolean;
  };
  createdAt: string;
  updatedAt: string;
  approved: boolean;
}

interface CommentSectionProps {
  post: BlogPost;
}

const CommentSection = ({ post }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    content: '',
    name: '',
    email: '',
    phone: '',
  });

  // Load comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?postId=${post.id}`);
        const data = await response.json();
        setComments(data.comments || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [post.id]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post.id,
          postTitle: post.title,
          content: formData.content,
          author: {
            name: isAnonymous ? 'Anonymous' : formData.name,
            email: isAnonymous ? undefined : formData.email,
            phone: isAnonymous ? undefined : formData.phone,
            isAnonymous,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([data.comment, ...comments]);
        setFormData({ content: '', name: '', email: '', phone: '' });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-ice-black/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <MessageCircle className="text-ice-yellow" size={24} />
            <h3 className="text-2xl font-bold text-ice-white">
              Comments ({comments.length})
            </h3>
          </div>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-ice-yellow text-ice-black px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-ice-gold hover:scale-105"
          >
            Add Comment
          </button>
        </div>

        {/* Comment Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-ice-black/60 border border-ice-yellow/20 rounded-xl p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Anonymous Toggle */}
                  <div className="flex items-center gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className="flex items-center gap-2 text-ice-white hover:text-ice-yellow transition-colors"
                    >
                      {isAnonymous ? <EyeOff size={16} /> : <Eye size={16} />}
                      <span className="text-sm">
                        {isAnonymous ? 'Comment Anonymously' : 'Comment with Details'}
                      </span>
                    </button>
                  </div>

                  {/* User Details (if not anonymous) */}
                  {!isAnonymous && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-ice-white text-sm font-medium mb-2">
                          <User size={14} className="inline mr-1" />
                          Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3 py-2 bg-ice-black/40 border border-ice-yellow/30 rounded-lg text-ice-white placeholder-ice-white/50 focus:border-ice-yellow focus:outline-none"
                          placeholder="Your name"
                          required={!isAnonymous}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-ice-white text-sm font-medium mb-2">
                          <Mail size={14} className="inline mr-1" />
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2 bg-ice-black/40 border border-ice-yellow/30 rounded-lg text-ice-white placeholder-ice-white/50 focus:border-ice-yellow focus:outline-none"
                          placeholder="your@email.com"
                          required={!isAnonymous}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-ice-white text-sm font-medium mb-2">
                          <Phone size={14} className="inline mr-1" />
                          Phone (Optional)
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3 py-2 bg-ice-black/40 border border-ice-yellow/30 rounded-lg text-ice-white placeholder-ice-white/50 focus:border-ice-yellow focus:outline-none"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  )}

                  {/* Comment Content */}
                  <div>
                    <label className="block text-ice-white text-sm font-medium mb-2">
                      Your Comment *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-3 py-2 bg-ice-black/40 border border-ice-yellow/30 rounded-lg text-ice-white placeholder-ice-white/50 focus:border-ice-yellow focus:outline-none resize-none"
                      rows={4}
                      placeholder="Share your thoughts..."
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between">
                    <p className="text-ice-white/60 text-xs">
                      {isAnonymous 
                        ? 'Your comment will be posted anonymously' 
                        : 'Your details will be stored securely for 1 week'
                      }
                    </p>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.content.trim()}
                      className="inline-flex items-center gap-2 bg-ice-yellow text-ice-black px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-ice-gold hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={16} />
                      {isSubmitting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comments List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-ice-black/60 border border-ice-yellow/20 rounded-xl p-6 animate-pulse">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-ice-yellow/20 rounded-full"></div>
                    <div className="h-4 w-24 bg-ice-yellow/20 rounded"></div>
                    <div className="h-3 w-16 bg-ice-yellow/20 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-ice-yellow/20 rounded w-full"></div>
                    <div className="h-4 bg-ice-yellow/20 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="text-ice-yellow/50 mx-auto mb-4" size={48} />
              <h4 className="text-xl font-semibold text-ice-white mb-2">No comments yet</h4>
              <p className="text-ice-white/60">Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-ice-black/60 border border-ice-yellow/20 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-ice-yellow/20 rounded-full flex items-center justify-center">
                    <User size={16} className="text-ice-yellow" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-ice-white">
                      {comment.author.name}
                    </h5>
                    <p className="text-ice-white/50 text-xs">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <p className="text-ice-white/80 leading-relaxed">
                  {comment.content}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default CommentSection;
