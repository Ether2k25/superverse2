'use client';

import { useEffect, useState } from 'react';
import FaviconProvider from './FaviconProvider';

interface CustomizationProviderProps {
  children: React.ReactNode;
}

const CustomizationProvider = ({ children }: CustomizationProviderProps) => {
  const [customization, setCustomization] = useState<any>(null);

  useEffect(() => {
    fetchCustomization();
  }, []);

  // Listen for customization updates
  useEffect(() => {
    const handleCustomizationUpdate = () => {
      fetchCustomization();
    };

    window.addEventListener('customizationUpdated', handleCustomizationUpdate);
    return () => {
      window.removeEventListener('customizationUpdated', handleCustomizationUpdate);
    };
  }, []);

  const fetchCustomization = async () => {
    try {
      const response = await fetch(`/api/customization?t=${Date.now()}`, { 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCustomization(data.customization);
      }
    } catch (error) {
      console.error('Error fetching customization:', error);
    }
  };

  return (
    <>
      <FaviconProvider faviconUrl={customization?.branding?.favicon} />
      {children}
    </>
  );
};

export default CustomizationProvider;
