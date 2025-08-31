'use client';

import { useEffect } from 'react';

interface FaviconProviderProps {
  faviconUrl?: string;
}

const FaviconProvider = ({ faviconUrl }: FaviconProviderProps) => {
  useEffect(() => {
    // Always update favicon, use default if none provided
    const finalFaviconUrl = faviconUrl && faviconUrl.trim() !== '' 
      ? faviconUrl 
      : '/uploads/17565402625218go8gjw2t-1756540262521-image.png';
    
    // Remove existing favicon links
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(link => link.remove());

    // Add new favicon with cache busting
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = `${finalFaviconUrl}?v=${Date.now()}`;
    document.head.appendChild(link);

    // Also add apple-touch-icon for mobile devices
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.href = `${finalFaviconUrl}?v=${Date.now()}`;
    document.head.appendChild(appleTouchIcon);

    // Add shortcut icon for better compatibility
    const shortcutIcon = document.createElement('link');
    shortcutIcon.rel = 'shortcut icon';
    shortcutIcon.href = `${finalFaviconUrl}?v=${Date.now()}`;
    document.head.appendChild(shortcutIcon);

    console.log('Favicon updated to:', finalFaviconUrl);
  }, [faviconUrl]);

  return null;
};

export default FaviconProvider;
