'use client';

import Link from 'next/link';
import { Twitter, Linkedin, Github, Mail, Facebook, Instagram, Youtube, ExternalLink } from 'lucide-react';

interface FooterProps {
  customization?: any;
}

const Footer = ({ customization }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  // Icon mapping for social links
  const iconMap: { [key: string]: any } = {
    twitter: Twitter,
    linkedin: Linkedin,
    github: Github,
    facebook: Facebook,
    instagram: Instagram,
    youtube: Youtube,
    link: ExternalLink,
    mail: Mail,
  };

  // Use customization data or fallback to defaults
  const footerData = customization?.footer || {};
  
  const companyName = footerData.companyName || 'ICE SUPER';
  const description = footerData.description || 'Leading B2B iGaming platform providing cutting-edge technology solutions for casino operators and affiliates worldwide.';
  const copyright = footerData.copyright || `© ${currentYear} ICE SUPER. All rights reserved.`;
  const poweredBy = footerData.poweredBy || 'Made with ⚡ by ICE SUPER';
  
  const socialLinks = footerData.socialLinks || [
    { name: 'Twitter', url: 'https://twitter.com/icesuper', icon: 'twitter' },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/icesuper', icon: 'linkedin' },
    { name: 'GitHub', url: 'https://github.com/icesuper', icon: 'github' },
  ];

  const footerSections = footerData.sections || [
    {
      title: 'Platform',
      links: [
        { name: 'Features', href: '/platform/features' },
        { name: 'Pricing', href: '/platform/pricing' },
        { name: 'API Docs', href: '/platform/api' },
        { name: 'Integrations', href: '/platform/integrations' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Blog', href: '/blog' },
        { name: 'Case Studies', href: '/case-studies' },
        { name: 'Whitepapers', href: '/whitepapers' },
        { name: 'Webinars', href: '/webinars' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' },
        { name: 'Press', href: '/press' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Compliance', href: '/compliance' },
      ]
    }
  ];

  const bottomLinks = footerData.bottomLinks || [
    { name: 'Sitemap', href: '/sitemap' },
    { name: 'RSS Feed', href: '/rss' }
  ];

  return (
    <footer className="bg-theme-background border-t border-theme-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              {footerData.logoImage ? (
                <div className="flex items-center gap-3">
                  <img
                    src={footerData.logoImage}
                    alt={`${companyName} Logo`}
                    className="h-8 w-auto object-contain"
                  />
                  <div className="text-2xl font-bold text-theme-primary">
                    {companyName}
                  </div>
                </div>
              ) : (
                <div className="text-2xl font-bold text-theme-primary">
                  {companyName}
                </div>
              )}
            </Link>
            <p className="text-theme-text/70 text-sm mb-6 max-w-sm">
              {description}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social: any) => {
                const Icon = iconMap[social.icon] || ExternalLink;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-theme-text/60 hover:text-theme-primary transition-colors duration-300"
                    aria-label={social.name}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section: any) => (
            <div key={section.title}>
              <h3 className="text-theme-text font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links?.map((link: any) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-theme-text/70 hover:text-theme-primary text-sm transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-theme-primary/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-theme-text/60 text-sm mb-4 md:mb-0">
              {copyright}
            </p>
            
            <div className="flex items-center space-x-6 text-sm">
              {bottomLinks.map((link: any) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-theme-text/60 hover:text-theme-primary transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
              <span className="text-theme-text/40">
                {poweredBy}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
