import connectDB from './mongodb';
import AdminUser from '@/models/AdminUser';
import SiteSettings from '@/models/SiteSettings';
import { AdminStats, AdminSettings } from '@/types/admin';
import { getAllBlogPosts } from './blog-storage-mongodb';
import { getAllMediaFiles } from './media-storage-mongodb';

// Admin User Management
export async function getAdminUser(username: string): Promise<any> {
  await connectDB();
  const user = await AdminUser.findOne({ username }).lean();
  if (!user) return null;
  
  return {
    ...user,
    id: user._id.toString(),
    _id: undefined
  };
}

export async function createAdminUser(userData: {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'editor' | 'author';
}): Promise<any> {
  await connectDB();
  
  const user = await AdminUser.create({
    ...userData,
    role: userData.role || 'admin'
  });
  
  return {
    ...user.toObject(),
    id: user._id.toString(),
    _id: undefined
  };
}

export async function updateAdminUser(id: string, updateData: any): Promise<any> {
  await connectDB();
  
  const user = await AdminUser.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  ).lean();
  
  if (!user) return null;
  
  return {
    ...user,
    id: user._id.toString(),
    _id: undefined
  };
}

// Site Settings Management
export async function getSiteSettings(): Promise<any> {
  await connectDB();
  
  let settings = await SiteSettings.findOne({}).lean();
  
  // If no settings exist, create default settings
  if (!settings) {
    const defaultSettings = {
      hero: {
        title: 'ICE SUPER Blog',
        subtitle: 'Casino Tech, Affiliate Growth & the Future of iGaming',
        description: 'Stay ahead of the curve with expert insights, cutting-edge technology trends, and proven strategies that drive success in the dynamic world of online gaming.',
        backgroundImage: '',
        ctaText: 'Explore Latest Insights',
        ctaLink: '#featured'
      },
      navbar: {
        logo: 'ICE SUPER',
        logoImage: '',
        menuItems: [
          { name: 'Home', href: '/' },
          { name: 'Blog', href: '/blog' },
          { name: 'Categories', href: '/categories' },
          { name: 'About', href: '/about' },
          { name: 'Contact', href: '/contact' }
        ]
      },
      footer: {
        companyName: 'ICE SUPER',
        description: 'Leading the future of iGaming with innovative technology and strategic insights.',
        copyright: '© 2024 ICE SUPER. All rights reserved.',
        socialLinks: [
          { name: 'Twitter', url: 'https://twitter.com/icesuper', icon: 'twitter' },
          { name: 'LinkedIn', url: 'https://linkedin.com/company/icesuper', icon: 'linkedin' },
          { name: 'GitHub', url: 'https://github.com/icesuper', icon: 'github' }
        ],
        quickLinks: [
          { name: 'Privacy Policy', href: '/privacy' },
          { name: 'Terms of Service', href: '/terms' },
          { name: 'Cookie Policy', href: '/cookies' }
        ]
      },
      branding: {
        primaryColor: '#FFC300',
        secondaryColor: '#FFD700',
        backgroundColor: '#0f0f0f',
        textColor: '#ffffff',
        accentColor: '#FFC300',
        customCSS: ''
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        fontSize: {
          small: '14px',
          medium: '16px',
          large: '18px',
          xlarge: '24px'
        }
      },
      ctaBanner: {
        enabled: true,
        title: 'Ready to Transform Your iGaming Strategy?',
        description: 'Join thousands of industry professionals who trust ICE SUPER for the latest insights and innovations.',
        buttonText: 'Get Started Today',
        buttonLink: '/contact',
        backgroundColor: '#FFC300',
        textColor: '#0f0f0f'
      },
      seo: {
        metaTitle: 'ICE SUPER Blog - Casino Tech & iGaming Future',
        metaDescription: 'Stay ahead with expert insights on casino technology, affiliate growth strategies, and the future of iGaming industry.',
        keywords: 'iGaming, casino technology, affiliate marketing, online gaming, casino trends',
        ogImage: '',
        favicon: '/favicon.ico'
      },
      blog: {
        postsPerPage: 9,
        showExcerpts: true,
        enableComments: false,
        enableSocialSharing: true,
        categories: ['Technology', 'Strategy', 'Industry News', 'Affiliate Marketing', 'Casino Games', 'Regulation']
      },
      admin: {
        siteName: 'ICE SUPER Blog',
        siteDescription: 'Casino Tech, Affiliate Growth & the Future of iGaming',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        adminEmail: 'admin@icesuper.com',
        allowRegistration: false,
        maintenanceMode: false,
        maxFileSize: 10485760, // 10MB
        allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      }
    };
    
    settings = await SiteSettings.create(defaultSettings);
  }
  
  return {
    ...settings,
    id: settings._id.toString(),
    _id: undefined
  };
}

export async function updateSiteSettings(updates: any): Promise<any> {
  await connectDB();
  
  let settings = await SiteSettings.findOne({});
  
  if (!settings) {
    // Create new settings if none exist
    settings = await SiteSettings.create(updates);
  } else {
    // Update existing settings
    Object.keys(updates).forEach(key => {
      if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
        settings[key] = { ...settings[key], ...updates[key] };
      } else {
        settings[key] = updates[key];
      }
    });
    await settings.save();
  }
  
  return {
    ...settings.toObject(),
    id: settings._id.toString(),
    _id: undefined
  };
}

// Admin Statistics
export async function getAdminStats(): Promise<AdminStats> {
  const blogPosts = await getAllBlogPosts();
  const mediaFiles = await getAllMediaFiles();
  
  const totalPosts = blogPosts.length;
  const publishedPosts = blogPosts.filter(post => post.published).length;
  
  // Get recent posts (last 5 published posts)
  const recentPosts = blogPosts
    .filter(post => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Calculate total storage used by media files
  const storageUsed = mediaFiles.reduce((sum, file) => sum + (file.size || 0), 0);

  return {
    totalPosts,
    publishedPosts,
    draftPosts: totalPosts - publishedPosts,
    totalViews: blogPosts.reduce((sum, post) => sum + (post.views || 0), 0),
    recentPosts,
    storageUsed,
    totalFiles: mediaFiles.length,
  };
}
