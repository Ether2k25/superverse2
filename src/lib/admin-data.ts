import { BlogPost, BlogPostBase, BlogPostSEO } from '@/types/blog';
import { AdminStats, AdminSettings } from '@/types/admin';
import { MediaFile } from './kv-utils';

// Simple slugify function
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
import {
  getBlogPosts as kvGetBlogPosts,
  getBlogPostById as kvGetBlogPostById,
  saveBlogPost as kvSaveBlogPost,
  deleteBlogPost as kvDeleteBlogPost,
  getMediaFiles as kvGetMediaFiles,
  getMediaFileById as kvGetMediaFileById,
  saveMediaFile as kvSaveMediaFile,
  deleteMediaFile as kvDeleteMediaFile,
  getAdminSettings as kvGetAdminSettings,
  saveAdminSettings as kvSaveAdminSettings,
  getSiteCustomization as kvGetSiteCustomization,
  saveSiteCustomization as kvSaveSiteCustomization,
} from './kv-utils';

// Using Vercel KV for persistence

// Default settings
const defaultAdminSettings: AdminSettings = {
  siteName: 'ICE SUPER Blog',
  siteDescription: 'Casino Tech, Affiliate Growth & the Future of iGaming',
  siteUrl: 'http://localhost:3000',
  adminEmail: 'admin@icesuper.com',
  allowRegistration: false,
  maintenanceMode: false,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
};

// Deep merge helper function
function deepMerge(target: any, source: any) {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else if (Array.isArray(source[key]) && Array.isArray(target[key])) {
        output[key] = [...target[key], ...source[key]];
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// Comprehensive site customization settings
const defaultSiteCustomization = {
  // Hero Section
  hero: {
    title: 'ICE SUPER Blog',
    subtitle: 'Casino Tech, Affiliate Growth & the Future of iGaming',
    description: 'Stay ahead of the curve with expert insights, cutting-edge technology trends, and proven strategies that drive success in the dynamic world of online gaming.',
    backgroundImage: '',
    ctaText: 'Explore Latest Insights',
    ctaLink: '#featured',
  },
  // Navigation
  navbar: {
    logo: 'ICE SUPER',
    logoImage: '',
    menuItems: [
      { name: 'Home', href: '/' },
      { name: 'Blog', href: '/blog' },
      { name: 'Categories', href: '/categories' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
  },
  // Footer
  footer: {
    companyName: 'ICE SUPER',
    description: 'Leading the future of iGaming with innovative technology and strategic insights.',
    copyright: '© 2024 ICE SUPER. All rights reserved.',
    socialLinks: [
      { name: 'Twitter', url: 'https://twitter.com/icesuper', icon: 'twitter' },
      { name: 'LinkedIn', url: 'https://linkedin.com/company/icesuper', icon: 'linkedin' },
      { name: 'GitHub', url: 'https://github.com/icesuper', icon: 'github' },
    ],
    quickLinks: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  },
  // Colors & Branding
  branding: {
    primaryColor: '#FFC300', // Mustard Yellow
    secondaryColor: '#FFD700', // Gold
    backgroundColor: '#0f0f0f', // Deep Black
    textColor: '#ffffff', // Pure White
    accentColor: '#FFC300',
    customCSS: '',
  },
  // Typography
  typography: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    fontSize: {
      small: '14px',
      medium: '16px',
      large: '18px',
      xlarge: '24px',
    },
  },
  // CTA Banner
  ctaBanner: {
    enabled: true,
    title: 'Ready to Transform Your iGaming Strategy?',
    description: 'Join thousands of industry professionals who trust ICE SUPER for the latest insights and innovations.',
    buttonText: 'Get Started Today',
    buttonLink: '/contact',
    backgroundColor: '#FFC300',
    textColor: '#0f0f0f',
  },
  // SEO & Meta
  seo: {
    metaTitle: 'ICE SUPER Blog - Casino Tech & iGaming Future',
    metaDescription: 'Stay ahead with expert insights on casino technology, affiliate growth strategies, and the future of iGaming industry.',
    keywords: 'iGaming, casino technology, affiliate marketing, online gaming, casino trends',
    ogImage: '',
    favicon: '/favicon.ico',
  },
  // Blog Settings
  blog: {
    postsPerPage: 9,
    showExcerpts: true,
    enableComments: false,
    enableSocialSharing: true,
    categories: [
      'Technology',
      'Strategy',
      'Industry News',
      'Affiliate Marketing',
      'Casino Games',
      'Regulation',
    ],
  },
};

// Blog Post Management
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return await kvGetBlogPosts() || [];
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  return await kvGetBlogPostById(id) || null;
}

export async function createBlogPost(postData: Partial<BlogPostBase>): Promise<BlogPost> {
  const now = new Date().toISOString();
  const defaultSEO = {
    metaTitle: postData.title || 'New Blog Post',
    metaDescription: postData.excerpt || '',
    keywords: Array.isArray(postData.tags) ? postData.tags : [],
    ogImage: postData.featuredImage || null
  };

  const newPost: BlogPost = {
    id: Date.now().toString(),
    slug: postData.slug || slugify(postData.title || 'new-blog-post'),
    title: postData.title || 'New Blog Post',
    published: postData.published || false,
    date: postData.date || now,
    tags: Array.isArray(postData.tags) ? postData.tags : [],
    excerpt: postData.excerpt || (typeof postData.content === 'string' ? postData.content.substring(0, 200) + '...' : ''),
    featuredImage: postData.featuredImage || '',
    content: typeof postData.content === 'string' ? postData.content : '',
    author: typeof postData.author === 'string' || (postData.author && typeof postData.author === 'object' && 'name' in postData.author)
      ? postData.author
      : { name: 'Admin' },
    views: 0,
    likes: 0,
    comments: [],
    seo: {
      ...defaultSEO,
      ...(postData.seo || {})
    },
    createdAt: now,
    updatedAt: now
  };
  
  await kvSaveBlogPost(newPost.id, newPost);
  return newPost;
}

export async function updateBlogPost(id: string, postData: Partial<BlogPost>): Promise<BlogPost | null> {
  const existingPost = await getBlogPostById(id);
  if (!existingPost) return null;
  
  // Preserve existing values if not provided in the update
  const updatedPost: BlogPost = {
    ...existingPost,
    ...postData,
    id, // Ensure ID doesn't change
    slug: postData.title ? slugify(postData.title) : existingPost.slug,
    tags: Array.isArray(postData.tags) ? postData.tags : existingPost.tags,
    author: postData.author || existingPost.author,
    seo: {
      ...existingPost.seo,
      ...(postData.seo || {})
    },
    updatedAt: new Date().toISOString()
  };
  
  await kvSaveBlogPost(id, updatedPost);
  return updatedPost;
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  return await kvDeleteBlogPost(id) || false;
}

export async function togglePostPublished(id: string): Promise<BlogPost | null> {
  const post = await getBlogPostById(id);
  if (!post) return null;
  
  const updatedPost: BlogPost = {
    ...post,
    published: !post.published,
    updatedAt: new Date().toISOString(),
    // Ensure we don't lose any required fields
    tags: [...post.tags],
    seo: { ...post.seo },
    author: typeof post.author === 'string' ? post.author : { ...post.author }
  };
  
  await kvSaveBlogPost(id, updatedPost);
  return updatedPost;
}

// Media File Management
export async function getAllMediaFiles(): Promise<MediaFile[]> {
  return await kvGetMediaFiles();
}

export async function getMediaFileById(id: string): Promise<MediaFile | null> {
  return await kvGetMediaFileById(id);
}

export async function uploadMediaFile(file: {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
  uploadedBy: string;
}): Promise<MediaFile> {
  // In a real app, you would upload the file to a storage service like S3 or Cloudinary
  // and save the URL in the database. For this example, we'll just save the file info.
  const fileUrl = `/uploads/${file.filename}`;
  
  const mediaFile: Omit<MediaFile, 'id'> = {
    filename: file.filename,
    originalName: file.originalName,
    mimeType: file.mimeType,
    size: file.size,
    url: fileUrl,
    uploadedAt: new Date().toISOString(),
    uploadedBy: file.uploadedBy,
  };
  
  return await kvSaveMediaFile(mediaFile);
}

export async function deleteMediaFile(id: string): Promise<boolean> {
  return await kvDeleteMediaFile(id);
}

// Statistics
export async function getAdminStats(): Promise<AdminStats> {
  const blogPosts = await kvGetBlogPosts();
  const mediaFiles = await kvGetMediaFiles();
  
  const totalPosts = blogPosts.length;
  const publishedPosts = blogPosts.filter((post: BlogPost) => post.published).length;
  
  // Get recent posts (last 5 published posts)
  const recentPosts = blogPosts
    .filter((post: BlogPost) => post.published)
    .sort((a: BlogPost, b: BlogPost) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Calculate total storage used by media files
  const storageUsed = mediaFiles.reduce((sum, file) => sum + (file.size || 0), 0);

  return {
    totalPosts,
    publishedPosts,
    draftPosts: totalPosts - publishedPosts,
    totalViews: 0, // This would come from analytics
    recentPosts,
    storageUsed,
    totalFiles: mediaFiles.length,
  };
}

// Settings Management
export async function getAdminSettings(): Promise<AdminSettings> {
  const settings = await kvGetAdminSettings();
  return { ...defaultAdminSettings, ...settings };
}

export async function updateAdminSettings(settings: Partial<AdminSettings>): Promise<AdminSettings> {
  const currentSettings = await getAdminSettings();
  const updatedSettings = { ...currentSettings, ...settings };
  await kvSaveAdminSettings(updatedSettings);
  return updatedSettings;
}

// Site Customization Management
export async function getSiteCustomization(): Promise<typeof defaultSiteCustomization> {
  const customization = await kvGetSiteCustomization();
  return { ...defaultSiteCustomization, ...customization };
}

export async function updateSiteCustomization(updates: any): Promise<typeof defaultSiteCustomization> {
  const currentCustomization = await getSiteCustomization();
  const updatedCustomization = deepMerge(currentCustomization, updates);
  
  // Ensure required fields are not removed
  Object.keys(defaultSiteCustomization).forEach(key => {
    if (!(key in updatedCustomization)) {
      (updatedCustomization as any)[key] = (defaultSiteCustomization as any)[key];
    }
  });
  
  await kvSaveSiteCustomization(updatedCustomization);
  return updatedCustomization;
}

export async function resetSiteCustomization(): Promise<typeof defaultSiteCustomization> {
  await kvSaveSiteCustomization(defaultSiteCustomization);
  return defaultSiteCustomization;
}

// Search and Filtering
interface SearchFilters {
  published?: boolean;
  tags?: (string | number | boolean)[];
  dateFrom?: string;
  dateTo?: string;
}

export async function searchBlogPosts(query: string, filtersParam?: SearchFilters): Promise<BlogPost[]> {
  // Create a local variable with the correct type
  const filters = filtersParam as SearchFilters | undefined;
  let blogPosts = await kvGetBlogPosts() as BlogPost[];
  
  // Ensure we have an array of blog posts
  if (!Array.isArray(blogPosts)) {
    console.error('Expected an array of blog posts but received:', blogPosts);
    return [];
  }
  
  // Apply search query
  if (query) {
    const searchQuery = query.toLowerCase();
    blogPosts = blogPosts.filter((post: BlogPost) => 
      (post.title?.toLowerCase() || '').includes(searchQuery) ||
      (post.excerpt?.toLowerCase() || '').includes(searchQuery) ||
      (post.content?.toLowerCase() || '').includes(searchQuery) ||
      (Array.isArray(post.tags) && post.tags.some((tag: string) => 
        String(tag).toLowerCase().includes(searchQuery)
      ))
    );
  }
  
  // Apply filters
  if (filters) {
    // Apply published filter if specified
    if (filters.published !== undefined) {
      blogPosts = blogPosts.filter((post: BlogPost) => post.published === filters.published);
    }
    
    // Apply tags filter if specified
    if (filters.tags && filters.tags.length > 0) {
      const tagList = filters.tags.map(tag => String(tag));
      blogPosts = blogPosts.filter((post: BlogPost) => 
        Array.isArray(post.tags) && 
        tagList.some(tag => post.tags.includes(tag))
      );
    }
    
    // Apply date range filters if specified
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      blogPosts = blogPosts.filter((post: BlogPost) => new Date(post.date).getTime() >= fromDate.getTime());
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      blogPosts = blogPosts.filter((post: BlogPost) => new Date(post.date).getTime() <= toDate.getTime());
    }
  }
  
  // Sort by date in descending order
  return blogPosts.sort((a: BlogPost, b: BlogPost) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
