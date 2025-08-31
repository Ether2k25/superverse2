'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface CTABannerProps {
  customization?: any;
}

const CTABanner = ({ customization }: CTABannerProps) => {
  // Extract colors and content from customization
  const primaryColor = customization?.branding?.primaryColor || '#FFC300';
  const accentColor = customization?.branding?.accentColor || '#FFC300';
  const backgroundColor = customization?.branding?.backgroundColor || '#0f0f0f';
  const textColor = customization?.branding?.textColor || '#ffffff';
  
  // Extract CTA banner content
  const bannerTitle = customization?.ctaBanner?.title || 'Want to partner with ICE SUPER?';
  const bannerDescription = customization?.ctaBanner?.description || 'Join the leading B2B iGaming platform and accelerate your business growth with cutting-edge technology and industry expertise.';
  const buttonText = customization?.ctaBanner?.buttonText || 'Let\'s Talk';
  const buttonLink = customization?.ctaBanner?.buttonLink || '/contact';
  
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
    <section className="py-20 bg-gradient-to-r from-ice-black via-ice-black/90 to-ice-black relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ice-yellow/5 to-transparent"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>
            {bannerTitle}
          </h2>
          
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: textColor, opacity: 0.8 }}>
            {bannerDescription}
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isExternalLink(buttonLink) ? (
              <a
                href={formatExternalLink(buttonLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-bold text-lg px-12 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:opacity-90"
                style={{ 
                  backgroundColor: primaryColor, 
                  color: backgroundColor,
                  boxShadow: `0 0 20px ${primaryColor}40`
                }}
              >
                {buttonText}
              </a>
            ) : (
              <Link
                href={buttonLink}
                className="inline-block font-bold text-lg px-12 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:opacity-90"
                style={{ 
                  backgroundColor: primaryColor, 
                  color: backgroundColor,
                  boxShadow: `0 0 20px ${primaryColor}40`
                }}
              >
                {buttonText}
              </Link>
            )}
          </motion.div>

          {/* Decorative elements */}
          <div className="mt-12 flex justify-center space-x-8 opacity-30">
            <div className="w-2 h-2 bg-ice-yellow rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-ice-yellow rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-2 h-2 bg-ice-yellow rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTABanner;
