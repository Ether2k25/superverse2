'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { Calendar, Tag, Star } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
  index: number;
  customization?: any;
}

const BlogCard = ({ post, index, customization }: BlogCardProps) => {
  // Extract colors from customization
  const primaryColor = customization?.branding?.primaryColor || '#FFC300';
  const accentColor = customization?.branding?.accentColor || '#FFC300';
  const textColor = customization?.branding?.textColor || '#ffffff';
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="blog-card backdrop-blur-sm rounded-xl overflow-hidden card-hover group flex flex-col h-full"
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-theme-primary/20 to-theme-secondary/20 flex items-center justify-center">
            <div className="text-theme-primary text-4xl font-bold opacity-50">
              ICE
            </div>
          </div>
        )}
        
        {/* Featured Badge */}
        {post.featured && (
          <div className="absolute top-3 right-3 bg-ice-yellow text-ice-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <Star size={12} fill="currentColor" />
            Featured
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-ice-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col h-full">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 theme-text-primary text-xs theme-bg-primary/10 px-3 py-1.5 rounded-full border theme-border-primary/20"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold theme-text-main mb-4 line-clamp-2 group-hover:theme-text-primary transition-colors duration-300 leading-tight">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="theme-text-main/70 text-base mb-6 line-clamp-3 leading-relaxed flex-grow">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t theme-border-primary/10">
          {/* Date */}
          <div className="flex items-center gap-2 theme-text-main/50 text-sm">
            <Calendar size={16} />
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>

          {/* Read More CTA */}
          <Link
            href={`/blog/${post.slug}`}
            className="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Read More
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;
