import fs from 'fs';
import path from 'path';

const CUSTOMIZATION_FILE = path.join(process.cwd(), 'data', 'site-customization.json');

// Default site customization
const defaultCustomization = {
  hero: {
    title: 'Welcome to ICE SUPER',
    subtitle: 'Casino Tech, Affiliate Growth & the Future of iGaming',
    description: 'Discover the latest insights, strategies, and innovations in the casino technology and affiliate marketing space.',
    ctaText: 'Explore Blog',
    ctaLink: '/blog',
    backgroundImage: ''
  },
  navbar: {
    logo: 'ICE SUPER',
    logoImage: '',
    menuItems: [
      { name: 'Home', href: '/' },
      { name: 'Blog', href: '/blog' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' }
    ]
  },
  footer: {
    companyName: 'ICE SUPER',
    description: 'Leading B2B iGaming platform providing cutting-edge technology solutions for casino operators and affiliates worldwide.',
    copyright: '© 2025 ICE SUPER. All rights reserved.',
    socialLinks: [
      { name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
      { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
      { name: 'GitHub', url: 'https://github.com', icon: 'github' }
    ],
    sections: [
      {
        title: 'Platform',
        links: [
          { name: 'Features', href: '/features' },
          { name: 'Pricing', href: '/pricing' },
          { name: 'API Docs', href: '/api-docs' },
          { name: 'Integrations', href: '/integrations' }
        ]
      },
      {
        title: 'Resources',
        links: [
          { name: 'Blog', href: '/blog' },
          { name: 'Case Studies', href: '/case-studies' },
          { name: 'Whitepapers', href: '/whitepapers' },
          { name: 'Webinars', href: '/webinars' }
        ]
      },
      {
        title: 'Company',
        links: [
          { name: 'About Us', href: '/about' },
          { name: 'Careers', href: '/careers' },
          { name: 'Contact', href: '/contact' },
          { name: 'Press', href: '/press' }
        ]
      },
      {
        title: 'Legal',
        links: [
          { name: 'Privacy Policy', href: '/privacy' },
          { name: 'Terms of Service', href: '/terms' },
          { name: 'Cookie Policy', href: '/cookies' },
          { name: 'Compliance', href: '/compliance' }
        ]
      }
    ],
    bottomLinks: [
      { name: 'Sitemap', href: '/sitemap' },
      { name: 'RSS Feed', href: '/rss' }
    ],
    poweredBy: 'Made with ❤️ by ICE SUPER'
  },
  branding: {
    primaryColor: '#FFC300',
    secondaryColor: '#FFD700', 
    backgroundColor: '#0A0A0A',
    textColor: '#FFFFFF',
    accentColor: '#FFC300',
    favicon: '/favicon.ico',
    customCSS: ''
  },
  typography: {
    primaryFont: 'Inter',
    headingFont: 'Inter',
    fontSize: {
      base: '16px',
      heading: '2rem'
    }
  },
  ctaButtons: {
    primary: {
      text: 'Get Started',
      link: '/contact',
      style: 'gradient'
    },
    secondary: {
      text: 'Learn More',
      link: '/about',
      style: 'outline'
    }
  },
  seo: {
    title: 'ICE SUPER - Casino Tech & Affiliate Growth',
    description: 'Leading insights in casino technology, affiliate marketing, and iGaming innovation.',
    keywords: 'casino, technology, affiliate, marketing, iGaming, slots, poker',
    ogImage: '',
    twitterCard: 'summary_large_image'
  },
  blog: {
    postsPerPage: 6,
    showAuthor: true,
    showDate: true,
    showCategories: true,
    showReadTime: true,
    enableComments: true
  },
  contact: {
    email: 'hello@icesuper.com',
    phone: '+1 (555) 123-4567',
    address: 'San Francisco, CA',
    socialMedia: {
      twitter: 'https://twitter.com/icesuper',
      linkedin: 'https://linkedin.com/company/icesuper',
      github: 'https://github.com/icesuper'
    }
  }
};

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(CUSTOMIZATION_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Deep merge helper function
function deepMerge(target: any, source: any): any {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// Get site customization
export async function getSiteCustomization(): Promise<any> {
  try {
    ensureDataDirectory();
    
    if (!fs.existsSync(CUSTOMIZATION_FILE)) {
      // Create default customization file
      fs.writeFileSync(CUSTOMIZATION_FILE, JSON.stringify(defaultCustomization, null, 2));
      return defaultCustomization;
    }
    
    const data = fs.readFileSync(CUSTOMIZATION_FILE, 'utf8');
    const customization = JSON.parse(data);
    
    // Merge with defaults to ensure all fields exist
    return deepMerge(defaultCustomization, customization);
  } catch (error) {
    console.error('Error reading customization file:', error);
    return defaultCustomization;
  }
}

// Update site customization
export async function updateSiteCustomization(updates: any): Promise<any> {
  try {
    ensureDataDirectory();
    
    // Get current customization
    const current = await getSiteCustomization();
    
    // Deep merge updates with current customization
    const updated = deepMerge(current, updates);
    
    // Save to file
    fs.writeFileSync(CUSTOMIZATION_FILE, JSON.stringify(updated, null, 2));
    
    return updated;
  } catch (error) {
    console.error('Error updating customization:', error);
    throw error;
  }
}

// Reset site customization to defaults
export async function resetSiteCustomization(): Promise<any> {
  try {
    ensureDataDirectory();
    
    // Write default customization to file
    fs.writeFileSync(CUSTOMIZATION_FILE, JSON.stringify(defaultCustomization, null, 2));
    
    return defaultCustomization;
  } catch (error) {
    console.error('Error resetting customization:', error);
    throw error;
  }
}

// Get public customization (for frontend)
export async function getPublicCustomization(): Promise<any> {
  const customization = await getSiteCustomization();
  
  // Return only public-facing customization data
  return {
    hero: customization.hero,
    navbar: customization.navbar,
    footer: customization.footer,
    branding: customization.branding,
    typography: customization.typography,
    ctaButtons: customization.ctaButtons,
    seo: customization.seo,
    blog: customization.blog,
    contact: customization.contact
  };
}
