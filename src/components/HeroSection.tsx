'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { Calendar, Tag } from 'lucide-react';

interface HeroSectionProps {
  featuredPost?: BlogPost;
  customization?: any;
}

const HeroSection = ({ featuredPost, customization }: HeroSectionProps) => {
  // Use customization data or fallback to defaults
  const heroTitle = customization?.hero?.title || 'ICE SUPER Blog';
  const heroSubtitle = customization?.hero?.subtitle || 'Casino Tech, Affiliate Growth & the Future of iGaming';
  const heroDescription = customization?.hero?.description || 'Stay ahead of the curve with expert insights, cutting-edge technology trends, and proven strategies that drive success in the dynamic world of online gaming.';
  const ctaText = customization?.hero?.ctaText || 'Explore Latest Insights';
  const ctaLink = customization?.hero?.ctaLink || '#featured';
  const backgroundImage = customization?.hero?.backgroundImage;
  
  // Helper function to detect external links
  const isExternalLink = (url: string) => {
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('www.') || url.includes('.');
  };
  
  // Format external links to include protocol
  const formatExternalLink = (url: string) => {
    if (url.startsWith('www.')) {
      return `https://${url}`;
    }
    if (url.includes('.') && !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
      return `https://${url}`;
    }
    return url;
  };
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-ice-black/60"></div>
        </div>
      )}
      
      {/* Spotlight Background Effect */}
      <div className="absolute inset-0 spotlight-glow animate-spotlight"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-ice-white mb-6"
          >
            {heroTitle}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-ice-white/80 max-w-3xl mx-auto mb-8"
          >
            {heroSubtitle}
          </motion.p>
          
          {/* Main Hero CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            {isExternalLink(ctaLink) ? (
              <a
                href={formatExternalLink(ctaLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button inline-block"
                style={{
                  backgroundColor: customization?.branding?.primaryColor || '#FFC300',
                  color: customization?.branding?.backgroundColor || '#0f0f0f'
                }}
              >
                {ctaText}
              </a>
            ) : (
              <Link
                href={ctaLink}
                className="cta-button inline-block"
                style={{
                  backgroundColor: customization?.branding?.primaryColor || '#FFC300',
                  color: customization?.branding?.backgroundColor || '#0f0f0f'
                }}
              >
                {ctaText}
              </Link>
            )}
          </motion.div>
        </div>

        {/* Featured Blog Card */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-ice-black/60 backdrop-blur-sm border-2 border-ice-yellow rounded-2xl overflow-hidden card-hover animate-glow">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative h-64 md:h-80">
                  {featuredPost.featuredImage ? (
                    isExternalLink(ctaLink) ? (
                      <a
                        href={formatExternalLink(ctaLink)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full"
                      >
                        <Image
                          src={featuredPost.featuredImage}
                          alt={featuredPost.title}
                          fill
                          className="object-cover"
                        />
                      </a>
                    ) : (
                      <Link href={ctaLink} className="block w-full h-full">
                        <Image
                          src={featuredPost.featuredImage}
                          alt={featuredPost.title}
                          fill
                          className="object-cover"
                        />
                      </Link>
                    )
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-ice-yellow/20 to-ice-gold/20 flex items-center justify-center">
                      <div className="text-ice-yellow text-6xl font-bold opacity-50">
                        ICE
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-ice-yellow text-ice-black px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    {featuredPost.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-ice-yellow text-sm"
                      >
                        <Tag size={14} />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-ice-white mb-4 leading-tight">
                    {featuredPost.title}
                  </h2>

                  <p className="text-ice-white/80 mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-ice-white/60 text-sm">
                      <Calendar size={16} />
                      {new Date(featuredPost.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>

                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="cta-button"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
