import fs from 'fs/promises';
import path from 'path';
import { BlogPost, BlogPostBase, BlogPostCreateData } from '@/types/blog';

// File paths for persistence
const DATA_DIR = path.join(process.cwd(), 'data');
const BLOG_POSTS_FILE = path.join(DATA_DIR, 'blog-posts.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Load blog posts from file
async function loadBlogPosts(): Promise<BlogPost[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(BLOG_POSTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // File doesn't exist, return empty array
    return [];
  }
}

// Save blog posts to file
async function saveBlogPosts(posts: BlogPost[]): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(BLOG_POSTS_FILE, JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error('Error saving blog posts:', error);
    throw error;
  }
}

// Get all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return await loadBlogPosts();
}

// Get blog post by ID
export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const posts = await loadBlogPosts();
  return posts.find(post => post.id === id) || null;
}

// Get blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await loadBlogPosts();
  return posts.find(post => post.slug === slug) || null;
}

// Create new blog post
export async function createBlogPost(postData: BlogPostCreateData): Promise<BlogPost> {
  const posts = await loadBlogPosts();
  
  // Check if slug already exists
  const existingPost = posts.find(post => post.slug === postData.slug);
  if (existingPost) {
    throw new Error('A post with this slug already exists');
  }

  const newPost: BlogPost = {
    id: generateId(),
    title: postData.title,
    slug: postData.slug || generateSlug(postData.title),
    excerpt: postData.excerpt,
    content: postData.content || '',
    tags: postData.tags || [],
    published: postData.published || false,
    featuredImage: postData.featuredImage || undefined,
    date: postData.date || new Date().toISOString().split('T')[0],
    categoryId: postData.categoryId,
    author: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
    likes: 0,
    comments: [],
    seo: postData.seo || {
      metaTitle: postData.title,
      metaDescription: postData.excerpt,
      keywords: postData.tags || [],
      ogImage: postData.featuredImage || null,
    },
  };

  posts.push(newPost);
  await saveBlogPosts(posts);
  
  return newPost;
}

// Update blog post
export async function updateBlogPost(id: string, updateData: Partial<BlogPostCreateData>): Promise<BlogPost | null> {
  const posts = await loadBlogPosts();
  const postIndex = posts.findIndex(post => post.id === id);
  
  if (postIndex === -1) {
    return null;
  }

  // Check if slug already exists (excluding current post)
  if (updateData.slug) {
    const existingPost = posts.find(post => post.slug === updateData.slug && post.id !== id);
    if (existingPost) {
      throw new Error('A post with this slug already exists');
    }
  }

  const updatedPost: BlogPost = {
    ...posts[postIndex],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };

  posts[postIndex] = updatedPost;
  await saveBlogPosts(posts);
  
  return updatedPost;
}

// Delete blog post
export async function deleteBlogPost(id: string): Promise<boolean> {
  const posts = await loadBlogPosts();
  const postIndex = posts.findIndex(post => post.id === id);
  
  if (postIndex === -1) {
    return false;
  }

  posts.splice(postIndex, 1);
  await saveBlogPosts(posts);
  
  return true;
}

// Search blog posts
export async function searchBlogPosts(
  query: string = '',
  filters: {
    published?: boolean;
    tags?: string[];
    categoryId?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {}
): Promise<BlogPost[]> {
  const posts = await loadBlogPosts();
  
  return posts.filter(post => {
    // Text search
    if (query) {
      const searchText = query.toLowerCase();
      const matchesTitle = post.title.toLowerCase().includes(searchText);
      const matchesExcerpt = post.excerpt.toLowerCase().includes(searchText);
      const matchesContent = post.content.toLowerCase().includes(searchText);
      const matchesTags = post.tags.some(tag => tag.toLowerCase().includes(searchText));
      
      if (!matchesTitle && !matchesExcerpt && !matchesContent && !matchesTags) {
        return false;
      }
    }

    // Published filter
    if (filters.published !== undefined && post.published !== filters.published) {
      return false;
    }

    // Category filter
    if (filters.categoryId && post.categoryId !== filters.categoryId) {
      return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => 
        post.tags.some(postTag => postTag.toLowerCase().includes(tag.toLowerCase()))
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    // Date filters
    if (filters.dateFrom && post.date < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && post.date > filters.dateTo) {
      return false;
    }

    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Get published blog posts (for public API)
export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const posts = await loadBlogPosts();
  return posts
    .filter(post => post.published)
    .sort((a, b) => {
      // Featured posts first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      // Then sort by date
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

// Increment post views
export async function incrementPostViews(id: string): Promise<void> {
  const posts = await loadBlogPosts();
  const postIndex = posts.findIndex(post => post.id === id);
  
  if (postIndex !== -1) {
    posts[postIndex].views = (posts[postIndex].views || 0) + 1;
    posts[postIndex].updatedAt = new Date().toISOString();
    await saveBlogPosts(posts);
  }
}

// Toggle post like
export async function togglePostLike(id: string): Promise<number> {
  const posts = await loadBlogPosts();
  const postIndex = posts.findIndex(post => post.id === id);
  
  if (postIndex !== -1) {
    posts[postIndex].likes = (posts[postIndex].likes || 0) + 1;
    posts[postIndex].updatedAt = new Date().toISOString();
    await saveBlogPosts(posts);
    return posts[postIndex].likes;
  }
  
  return 0;
}

// Toggle post published status
export async function togglePostPublished(id: string): Promise<BlogPost | null> {
  const posts = await loadBlogPosts();
  const postIndex = posts.findIndex(post => post.id === id);
  
  if (postIndex === -1) {
    return null;
  }

  posts[postIndex].published = !posts[postIndex].published;
  posts[postIndex].updatedAt = new Date().toISOString();
  await saveBlogPosts(posts);
  
  return posts[postIndex];
}
