'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { Calendar, Tag, ArrowLeft, Share2 } from 'lucide-react';

interface BlogPostHeaderProps {
  post: BlogPost;
}

const BlogPostHeader = ({ post }: BlogPostHeaderProps) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <header className="relative py-20 overflow-hidden">
      {/* Background Image with Overlay */}
      {post.featuredImage && (
        <div className="absolute inset-0">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-ice-black/80"></div>
        </div>
      )}

      {/* Spotlight effect for posts without cover image */}
      {!post.featuredImage && (
        <div className="absolute inset-0 spotlight-glow animate-spotlight"></div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-ice-yellow hover:text-ice-gold transition-colors duration-300"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </Link>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-ice-yellow text-sm bg-ice-yellow/10 px-3 py-1 rounded-full border border-ice-yellow/30"
            >
              <Tag size={12} />
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-ice-white mb-6 leading-tight"
        >
          {post.title}
        </motion.h1>

        {/* Excerpt */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl text-ice-white/80 mb-8 max-w-3xl"
        >
          {post.excerpt}
        </motion.p>

        {/* Meta Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="flex items-center gap-6 text-ice-white/70">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            
            {post.author && (
              <div className="flex items-center gap-2">
                {typeof post.author === 'object' && post.author.avatar && (
                  <Image
                    src={post.author.avatar}
                    alt={typeof post.author === 'object' ? post.author.name || 'Author' : post.author}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span>By {typeof post.author === 'object' ? post.author.name : post.author}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 text-ice-yellow hover:text-ice-gold transition-colors duration-300"
          >
            <Share2 size={18} />
            Share
          </button>
        </motion.div>
      </div>
    </header>
  );
};

export default BlogPostHeader;
