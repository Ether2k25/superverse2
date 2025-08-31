import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { getSiteCustomization } from './customization-storage';

// Initialize data directory and default files
export async function initializeDataDirectory() {
  const DATA_DIR = path.join(process.cwd(), 'data');
  
  try {
    // Ensure data directory exists
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log('✓ Created data directory');
  }

  // Initialize admin users if not exists
  const ADMIN_USERS_FILE = path.join(DATA_DIR, 'admin-users.json');
  const ADMIN_PASSWORDS_FILE = path.join(DATA_DIR, 'admin-passwords.json');
  
  try {
    await fs.access(ADMIN_USERS_FILE);
  } catch {
    // Create default admin user
    const defaultAdmin = {
      id: '1',
      username: 'admin',
      email: 'admin@icesuper.com',
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const defaultPasswords = {
      '1': hashedPassword
    };
    
    await fs.writeFile(ADMIN_USERS_FILE, JSON.stringify([defaultAdmin], null, 2));
    await fs.writeFile(ADMIN_PASSWORDS_FILE, JSON.stringify(defaultPasswords, null, 2));
    console.log('✓ Created default admin user (admin/admin123)');
  }

  // Initialize blog posts if not exists
  const BLOG_POSTS_FILE = path.join(DATA_DIR, 'blog-posts.json');
  
  try {
    await fs.access(BLOG_POSTS_FILE);
  } catch {
    // Create sample blog post
    const samplePost = {
      id: Date.now().toString(),
      title: 'Welcome to ICE SUPER Blog',
      slug: 'welcome-to-ice-super-blog',
      excerpt: 'Welcome to your new blog! This is a sample post to get you started.',
      content: `# Welcome to ICE SUPER Blog

This is your first blog post! You can edit or delete this post from the admin panel.

## Getting Started

1. Login to the admin panel at \`/admin/login\`
2. Use credentials: **admin** / **admin123**
3. Create your first blog post
4. Customize your site settings

## Features

- **Local File Storage** - No database required
- **Admin Panel** - Full content management
- **SEO Optimized** - Built-in SEO features
- **Responsive Design** - Works on all devices
- **Fast Performance** - Built with Next.js

Happy blogging! 🚀`,
      tags: ['welcome', 'getting-started'],
      published: true,
      featuredImage: undefined,
      date: new Date().toISOString().split('T')[0],
      author: 'Admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      comments: [],
      seo: {
        metaTitle: 'Welcome to ICE SUPER Blog',
        metaDescription: 'Welcome to your new blog! This is a sample post to get you started.',
        keywords: ['welcome', 'getting-started'],
        ogImage: null,
      },
    };
    
    await fs.writeFile(BLOG_POSTS_FILE, JSON.stringify([samplePost], null, 2));
    console.log('✓ Created sample blog post');
  }

  // Initialize uploads directory
  const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    console.log('✓ Created uploads directory');
  }

  // Initialize media files if not exists
  const MEDIA_FILES_FILE = path.join(DATA_DIR, 'media-files.json');
  try {
    await fs.access(MEDIA_FILES_FILE);
  } catch {
    await fs.writeFile(MEDIA_FILES_FILE, JSON.stringify([], null, 2));
    console.log('✓ Created media files database');
  }

  // Initialize categories if not exists
  const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
  try {
    await fs.access(CATEGORIES_FILE);
  } catch {
    const defaultCategories = [
      {
        id: '1',
        name: 'General',
        slug: 'general',
        description: 'General blog posts',
        color: '#6366f1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Technology',
        slug: 'technology',
        description: 'Tech-related articles',
        color: '#06b6d4',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Gaming',
        slug: 'gaming',
        description: 'Gaming and casino content',
        color: '#10b981',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
    await fs.writeFile(CATEGORIES_FILE, JSON.stringify(defaultCategories, null, 2));
    console.log('✓ Created default categories');
  }

  // Initialize admin settings if not exists
  const ADMIN_SETTINGS_FILE = path.join(DATA_DIR, 'admin-settings.json');
  
  try {
    await fs.access(ADMIN_SETTINGS_FILE);
  } catch {
    const defaultSettings = {
      siteName: 'ICE SUPER Blog',
      siteDescription: 'Casino Tech, Affiliate Growth & the Future of iGaming',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      adminEmail: 'admin@icesuper.com',
      allowRegistration: false,
      maintenanceMode: false,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    };
    
    await fs.writeFile(ADMIN_SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
    console.log('✓ Created default admin settings');
  }

  // Initialize site customization if not exists
  try {
    await getSiteCustomization();
    console.log('✓ Site customization initialized');
  } catch (error) {
    console.error('Error initializing site customization:', error);
  }

  console.log('✅ Data initialization complete');
}
