'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlogPost } from '@/types/blog';
import BlogCard from './BlogCard';

interface BlogGridProps {
  posts?: BlogPost[];
  isLoading?: boolean;
  customization?: any;
}

const BlogGrid = ({ posts: propsPosts, isLoading: propsIsLoading, customization }: BlogGridProps) => {
  const [internalPosts, setInternalPosts] = useState<BlogPost[]>([]);
  const [internalIsLoading, setInternalIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use props if provided, otherwise use internal state
  const posts = propsPosts ?? internalPosts;
  const isLoading = propsIsLoading ?? internalIsLoading;

  // Fetch data internally only if no props are provided
  useEffect(() => {
    if (propsPosts === undefined) {
      const fetchPosts = async () => {
        try {
          setInternalIsLoading(true);
          const response = await fetch('/api/posts');
          if (!response.ok) {
            throw new Error('Failed to fetch posts');
          }
          const data = await response.json();
          setInternalPosts(data.posts || []);
        } catch (err) {
          console.error('Error fetching posts:', err);
          setError('Failed to load blog posts');
        } finally {
          setInternalIsLoading(false);
        }
      };

      fetchPosts();
    }
  }, [propsPosts]);
  if (isLoading) {
    return (
      <section className="py-16 bg-ice-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-ice-black/60 border border-ice-yellow/20 rounded-xl overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-ice-yellow/10"></div>
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    <div className="h-5 w-16 bg-ice-yellow/10 rounded-full"></div>
                    <div className="h-5 w-20 bg-ice-yellow/10 rounded-full"></div>
                  </div>
                  <div className="h-6 bg-ice-yellow/10 rounded mb-3"></div>
                  <div className="h-4 bg-ice-yellow/10 rounded mb-2"></div>
                  <div className="h-4 bg-ice-yellow/10 rounded mb-4 w-3/4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-24 bg-ice-yellow/10 rounded"></div>
                    <div className="h-4 w-20 bg-ice-yellow/10 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <section className="py-16 bg-ice-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="py-12"
          >
            <div className="text-red-400 text-6xl mb-6">⚠️</div>
            <h3 className="text-2xl font-bold text-ice-white mb-4">
              Error Loading Posts
            </h3>
            <p className="text-ice-white/60 max-w-md mx-auto mb-6">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="cta-button px-6 py-3"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  if (posts.length === 0 && !isLoading) {
    return (
      <section className="py-16 bg-ice-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="py-12"
          >
            <div className="text-ice-yellow text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-ice-white mb-4">
              No posts found
            </h3>
            <p className="text-ice-white/60 max-w-md mx-auto">
              Try adjusting your search criteria or browse all posts to discover great content.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-ice-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr"
        >
          {posts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} customization={customization} />
          ))}
        </motion.div>

        {/* Load More Button (for future pagination) */}
        {posts.length >= 9 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12"
          >
            <button className="cta-button text-lg px-8 py-4">
              Load More Posts
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BlogGrid;
