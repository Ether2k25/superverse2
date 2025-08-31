'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ThemeColors {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

interface ThemeContextType {
  colors: ThemeColors;
  customCSS: string;
  updateTheme: (colors: ThemeColors, customCSS?: string) => void;
  refreshTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [colors, setColors] = useState<ThemeColors>({
    primaryColor: '#FFC300',
    secondaryColor: '#FFD700',
    backgroundColor: '#0A0A0A',
    textColor: '#FFFFFF',
    accentColor: '#FFC300'
  });
  const [customCSS, setCustomCSS] = useState('');

  const applyThemeToDOM = (themeColors: ThemeColors, css: string = '') => {
    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--theme-primary', themeColors.primaryColor);
    root.style.setProperty('--theme-secondary', themeColors.secondaryColor);
    root.style.setProperty('--theme-background', themeColors.backgroundColor);
    root.style.setProperty('--theme-text', themeColors.textColor);
    root.style.setProperty('--theme-accent', themeColors.accentColor);
    
    // Apply derived colors
    root.style.setProperty('--theme-primary-rgb', hexToRgb(themeColors.primaryColor));
    root.style.setProperty('--theme-secondary-rgb', hexToRgb(themeColors.secondaryColor));
    root.style.setProperty('--theme-accent-rgb', hexToRgb(themeColors.accentColor));
    
    // Apply custom CSS
    let customStyleElement = document.getElementById('custom-theme-css');
    if (!customStyleElement) {
      customStyleElement = document.createElement('style');
      customStyleElement.id = 'custom-theme-css';
      document.head.appendChild(customStyleElement);
    }
    customStyleElement.textContent = css;
  };

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '255, 255, 255';
  };

  const fetchTheme = async () => {
    try {
      const response = await fetch('/api/customization');
      if (response.ok) {
        const data = await response.json();
        const branding = data.customization?.branding;
        if (branding) {
          const newColors = {
            primaryColor: branding.primaryColor || '#FFC300',
            secondaryColor: branding.secondaryColor || '#FFD700',
            backgroundColor: branding.backgroundColor || '#0A0A0A',
            textColor: branding.textColor || '#FFFFFF',
            accentColor: branding.accentColor || '#FFC300'
          };
          const newCustomCSS = branding.customCSS || '';
          
          setColors(newColors);
          setCustomCSS(newCustomCSS);
          applyThemeToDOM(newColors, newCustomCSS);
        }
      }
    } catch (error) {
      console.error('Error fetching theme:', error);
    }
  };

  const updateTheme = (newColors: ThemeColors, newCustomCSS: string = '') => {
    setColors(newColors);
    setCustomCSS(newCustomCSS);
    applyThemeToDOM(newColors, newCustomCSS);
  };

  const refreshTheme = () => {
    fetchTheme();
  };

  useEffect(() => {
    fetchTheme();

    // Listen for customization updates
    const handleCustomizationUpdate = () => {
      fetchTheme();
    };

    window.addEventListener('customizationUpdated', handleCustomizationUpdate);
    return () => {
      window.removeEventListener('customizationUpdated', handleCustomizationUpdate);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ colors, customCSS, updateTheme, refreshTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
