'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, Eye, ArrowLeft, Image, Tag, Calendar, Folder, Plus, X, Star } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import MediaGalleryModal from '@/components/MediaGalleryModal';
import SEOChecker from '@/components/SEOChecker';
import { BlogPost } from '@/types/blog';

interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

export default function NewPostPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCoverImageGallery, setShowCoverImageGallery] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#6366f1',
  });
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: [] as string[],
    published: false,
    featuredImage: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    featured: false,
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const createCategory = async () => {
    if (!newCategory.name.trim()) return;

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategory.name.trim(),
          description: newCategory.description.trim(),
          color: newCategory.color,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const createdCategory = data.category;
        
        // Add to categories list and select it
        setCategories(prev => [...prev, createdCategory]);
        setFormData(prev => ({ ...prev, categoryId: createdCategory.id }));
        
        // Reset form and close modal
        setNewCategory({ name: '', description: '', color: '#6366f1' });
        setShowCreateCategory(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category');
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          published: publish,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push('/admin/posts');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 px-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-ice-white hover:text-ice-yellow transition-colors duration-300"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-ice-white">Create New Post</h1>
              <p className="text-ice-white/60">Write and publish your blog content</p>
            </div>
          </div>

        </div>

        {/* SEO Checker - Top Right */}
        <div className="fixed top-20 right-6 w-96 z-40">
          <SEOChecker
            title={formData.title}
            content={formData.content}
            excerpt={formData.excerpt}
            featuredImage={formData.featuredImage}
            slug={formData.slug}
          />
          
          {/* Action Buttons Below SEO Checker */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={(e) => handleSubmit(e, false)}
              disabled={isLoading || !formData.title.trim()}
              className="w-full px-4 py-2 border border-ice-yellow/30 text-ice-white rounded-lg hover:bg-ice-yellow/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Draft
            </button>
            <button
              onClick={(e) => handleSubmit(e, true)}
              disabled={isLoading || !formData.title.trim() || !formData.excerpt.trim()}
              className="w-full inline-flex items-center justify-center gap-2 bg-yellow-gradient text-ice-black font-semibold px-6 py-2 rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Eye size={18} />
              Publish
            </button>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6 pr-[420px]">
          {/* Main Content */}
          <div className="bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-ice-white font-medium mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 bg-ice-black/60 border border-ice-yellow/30 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:ring-2 focus:ring-ice-yellow focus:border-transparent text-xl font-semibold"
                placeholder="Enter post title..."
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-ice-white font-medium mb-2">
                URL Slug
              </label>
              <div className="flex items-center">
                <span className="text-ice-white/60 text-sm mr-2">/blog/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="flex-1 px-4 py-2 bg-ice-black/60 border border-ice-yellow/30 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:ring-2 focus:ring-ice-yellow focus:border-transparent"
                  placeholder="post-url-slug"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-ice-white font-medium mb-2">
                Excerpt *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full px-4 py-3 bg-ice-black/60 border border-ice-yellow/30 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:ring-2 focus:ring-ice-yellow focus:border-transparent resize-none"
                rows={3}
                placeholder="Brief description of your post..."
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-ice-white font-medium mb-2">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-4 py-3 bg-ice-black/60 border border-ice-yellow/30 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:ring-2 focus:ring-ice-yellow focus:border-transparent resize-none"
                rows={12}
                placeholder="Write your blog post content here..."
              />
              <p className="text-ice-white/50 text-sm mt-2">
                You can use Markdown formatting for rich text content.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl p-6">
              <h3 className="flex items-center gap-2 text-ice-white font-medium mb-4">
                <Folder size={18} />
                Category
              </h3>
              
              <div className="space-y-3">
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-4 py-3 bg-ice-black/60 border border-ice-yellow/30 rounded-lg text-ice-white focus:outline-none focus:ring-2 focus:ring-ice-yellow focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setShowCreateCategory(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-ice-yellow/10 text-ice-yellow border border-ice-yellow/30 rounded-lg hover:bg-ice-yellow/20 transition-colors duration-300"
                >
                  <Plus size={16} />
                  New
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl p-6">
              <h3 className="flex items-center gap-2 text-ice-white font-medium mb-4">
                <Tag size={18} />
                Tags
              </h3>
              
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-3 bg-ice-black/60 border border-ice-yellow/30 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:ring-2 focus:ring-ice-yellow focus:border-transparent"
                    placeholder="Add tag..."
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-3 bg-ice-yellow/10 text-ice-yellow rounded-lg hover:bg-ice-yellow/20 transition-colors duration-300"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-ice-yellow/10 text-ice-yellow px-3 py-1.5 rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-ice-yellow/60 hover:text-ice-yellow ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl p-6">
              <h3 className="flex items-center gap-2 text-ice-white font-medium mb-4">
                <Image size={18} />
                Cover Image
              </h3>
              
              <div className="space-y-4">
                <div>
                  <input
                    type="url"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                    className="w-full px-4 py-3 bg-ice-black/60 border border-ice-yellow/30 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:ring-2 focus:ring-ice-yellow focus:border-transparent"
                    placeholder="Image URL..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCoverImageGallery(true)}
                    className="px-4 py-3 bg-ice-yellow/10 text-ice-yellow border border-ice-yellow/30 rounded-lg hover:bg-ice-yellow/20 transition-colors duration-300 font-medium"
                  >
                    Browse Gallery
                  </button>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append('file', file);
                          
                          try {
                            const response = await fetch('/api/admin/media', {
                              method: 'POST',
                              body: formData,
                            });
                            
                            if (response.ok) {
                              const result = await response.json();
                              setFormData(prev => ({ ...prev, featuredImage: result.url }));
                            }
                          } catch (error) {
                            console.error('Upload failed:', error);
                          }
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="cover-image-upload"
                    />
                    <label
                      htmlFor="cover-image-upload"
                      className="flex items-center justify-center w-full px-4 py-3 bg-ice-yellow/10 text-ice-yellow border border-ice-yellow/30 rounded-lg hover:bg-ice-yellow/20 transition-colors duration-300 font-medium cursor-pointer"
                    >
                      Upload Image
                    </label>
                  </div>
                </div>
                
                {formData.featuredImage && (
                  <div className="relative">
                    <img
                      src={formData.featuredImage}
                      alt="Cover preview"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Publish Date */}
            <div className="bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl p-6">
              <h3 className="flex items-center gap-2 text-ice-white font-medium mb-4">
                <Calendar size={18} />
                Publish Date
              </h3>
              
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 bg-ice-black/60 border border-ice-yellow/30 rounded-lg text-ice-white focus:outline-none focus:ring-2 focus:ring-ice-yellow focus:border-transparent"
              />
            </div>

            {/* Featured Post */}
            <div className="bg-ice-black/60 backdrop-blur-sm border border-ice-yellow/20 rounded-xl p-6">
              <h3 className="flex items-center gap-2 text-ice-white font-medium mb-4">
                <Star size={18} />
                Featured Post
              </h3>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured-toggle"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-5 h-5 text-ice-yellow bg-ice-black/60 border-ice-yellow/30 rounded focus:ring-ice-yellow focus:ring-2"
                />
                <label htmlFor="featured-toggle" className="text-ice-white font-medium cursor-pointer">
                  Mark as featured post
                </label>
              </div>
              <p className="text-ice-white/60 text-sm mt-2">
                Featured posts will appear at the top of the blog list and have special highlighting.
              </p>
            </div>

          </div>
        </form>
      </div>

      {/* Create Category Modal */}
      {showCreateCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-ice-black border border-ice-yellow/20 rounded-xl p-6 max-w-md mx-4 w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-ice-white">Create New Category</h3>
              <button
                onClick={() => setShowCreateCategory(false)}
                className="p-1 text-ice-white/60 hover:text-ice-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-ice-white font-medium mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-ice-black/60 border border-ice-yellow/30 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:ring-2 focus:ring-ice-yellow focus:border-transparent"
                  placeholder="Enter category name..."
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-ice-white font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-ice-black/60 border border-ice-yellow/30 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:ring-2 focus:ring-ice-yellow focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Brief description..."
                />
              </div>

              <div>
                <label className="block text-ice-white font-medium mb-2">
                  Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                    className="w-12 h-10 rounded-lg border border-ice-yellow/30 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                    className="flex-1 px-3 py-2 bg-ice-black/60 border border-ice-yellow/30 rounded-lg text-ice-white placeholder-ice-white/50 focus:outline-none focus:ring-2 focus:ring-ice-yellow focus:border-transparent"
                    placeholder="#6366f1"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateCategory(false)}
                  className="flex-1 px-4 py-2 bg-ice-white/10 text-ice-white rounded-lg hover:bg-ice-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createCategory}
                  disabled={!newCategory.name.trim()}
                  className="flex-1 px-4 py-2 bg-ice-yellow text-ice-black rounded-lg hover:bg-ice-yellow/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Category
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Cover Image Gallery Modal */}
      <MediaGalleryModal
        isOpen={showCoverImageGallery}
        onClose={() => setShowCoverImageGallery(false)}
        onSelect={(url) => {
          setFormData(prev => ({ ...prev, featuredImage: url }));
          setShowCoverImageGallery(false);
        }}
        title="Select Cover Image"
      />
    </AdminLayout>
  );
}
