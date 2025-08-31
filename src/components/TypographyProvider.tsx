'use client';

import { useEffect, useState } from 'react';

interface TypographySettings {
  primaryFont?: string;
  headingFont?: string;
  baseFontSize?: string;
  lineHeight?: string;
}

export default function TypographyProvider({ children }: { children: React.ReactNode }) {
  const [typography, setTypography] = useState<TypographySettings | null>(null);
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Fetch typography settings from the customization API
    const fetchTypography = async () => {
      try {
        const response = await fetch('/api/customization');
        if (response.ok) {
          const data = await response.json();
          setTypography(data.customization?.typography || {});
        }
      } catch (error) {
        console.error('Error fetching typography settings:', error);
      }
    };

    fetchTypography();
  }, []);

  // Load Google Fonts dynamically
  const loadGoogleFont = (fontName: string) => {
    if (loadedFonts.has(fontName) || fontName === 'Inter') return; // Inter is already loaded
    
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    setLoadedFonts(prev => new Set([...Array.from(prev), fontName]));
  };

  useEffect(() => {
    if (typography?.primaryFont) {
      loadGoogleFont(typography.primaryFont);
    }
    if (typography?.headingFont) {
      loadGoogleFont(typography.headingFont);
    }
  }, [typography?.primaryFont, typography?.headingFont]);

  useEffect(() => {
    if (!typography) return;

    // Apply typography settings to CSS custom properties
    const root = document.documentElement;
    
    if (typography.primaryFont) {
      root.style.setProperty('--font-primary', `"${typography.primaryFont}", sans-serif`);
    }
    
    if (typography.headingFont) {
      root.style.setProperty('--font-heading', `"${typography.headingFont}", sans-serif`);
    }
    
    if (typography.baseFontSize) {
      root.style.setProperty('--font-size-base', typography.baseFontSize);
    }
    
    if (typography.lineHeight) {
      root.style.setProperty('--line-height-base', typography.lineHeight);
    }

    // Create dynamic styles for typography
    const styleId = 'dynamic-typography';
    let existingStyle = document.getElementById(styleId);
    
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      :root {
        --font-primary: "${typography.primaryFont || 'Inter'}", sans-serif;
        --font-heading: "${typography.headingFont || 'Inter'}", sans-serif;
        --font-size-base: ${typography.baseFontSize || '16px'};
        --line-height-base: ${typography.lineHeight || '1.6'};
      }
      
      body {
        font-family: var(--font-primary) !important;
        font-size: var(--font-size-base) !important;
        line-height: var(--line-height-base) !important;
      }
      
      h1, h2, h3, h4, h5, h6, .heading {
        font-family: var(--font-heading) !important;
      }
      
      .text-base {
        font-size: var(--font-size-base) !important;
        line-height: var(--line-height-base) !important;
      }
      
      .text-sm {
        font-size: calc(var(--font-size-base) * 0.875) !important;
      }
      
      .text-lg {
        font-size: calc(var(--font-size-base) * 1.125) !important;
      }
      
      .text-xl {
        font-size: calc(var(--font-size-base) * 1.25) !important;
      }
      
      .text-2xl {
        font-size: calc(var(--font-size-base) * 1.5) !important;
      }
      
      .text-3xl {
        font-size: calc(var(--font-size-base) * 1.875) !important;
      }
      
      .text-4xl {
        font-size: calc(var(--font-size-base) * 2.25) !important;
      }
      
      p, span, div, article {
        font-family: var(--font-primary) !important;
        line-height: var(--line-height-base) !important;
      }
    `;
    
    document.head.appendChild(style);
  }, [typography]);

  return <>{children}</>;
}
