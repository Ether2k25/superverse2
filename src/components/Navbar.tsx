'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  customization?: any;
}

const Navbar = ({ customization }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Extract customization data
  const logo = customization?.navbar?.logo || 'ICE SUPER';
  const logoImage = customization?.navbar?.logoImage;
  const logoText = customization?.navbar?.logoText || logo || 'ICE SUPER';
  
  // Debug logging
  console.log('Navbar customization:', customization);
  console.log('Navbar object:', customization?.navbar);
  console.log('Logo image URL:', logoImage);
  console.log('Full logoImage path:', customization?.navbar?.logoImage);
  console.log('Logo condition check:', logoImage && logoImage.trim() !== '');
  const navLinks = customization?.navbar?.menuItems || [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

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

  // Extract colors from customization
  const backgroundColor = customization?.branding?.backgroundColor || '#0f0f0f';
  const textColor = customization?.branding?.textColor || '#ffffff';
  const primaryColor = customization?.branding?.primaryColor || '#FFC300';
  const accentColor = customization?.branding?.accentColor || '#FFC300';

  return (
    <nav 
      className="sticky top-0 z-50 backdrop-blur-sm border-b" 
      style={{ 
        backgroundColor: backgroundColor + 'f2', // 95% opacity
        borderBottomColor: primaryColor + '33' // 20% opacity
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/uploads/17565382966621ufr247zf-1756538296661-logo.png"
              alt="ICE SUPER Logo"
              className="h-8 w-auto"
              onError={(e) => {
                console.error('Logo image failed to load');
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <div className="text-2xl font-bold hidden" style={{ color: primaryColor }}>
              {logo}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link: any) => (
              isExternalLink(link.href) ? (
                <a
                  key={link.name}
                  href={formatExternalLink(link.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium transition-colors duration-300 hover:opacity-80"
                  style={{ color: textColor }}
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium transition-colors duration-300 hover:opacity-80"
                  style={{ color: textColor }}
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="transition-colors duration-300 hover:opacity-80"
              style={{ color: textColor }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div 
              className="px-2 pt-2 pb-3 space-y-1 border-t" 
              style={{ 
                backgroundColor: backgroundColor, 
                borderTopColor: primaryColor + '33' // 20% opacity
              }}
            >
              {navLinks.map((link: { name: string; href: string }) => (
                isExternalLink(link.href) ? (
                  <a
                    key={link.name}
                    href={formatExternalLink(link.href)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 text-base font-medium transition-colors duration-300 hover:opacity-80"
                    style={{ color: textColor }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block px-3 py-2 text-base font-medium transition-colors duration-300 hover:opacity-80"
                    style={{ color: textColor }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
