import { BlogPost } from '@/types/blog';
import kvClient from '../../vercel-kv';

// Define the KV store keys
const BLOG_POSTS_KEY = 'blog-posts';
const MEDIA_FILES_KEY = 'media-files';
const ADMIN_SETTINGS_KEY = 'admin-settings';
const SITE_CUSTOMIZATION_KEY = 'site-customization';

// Helper function to safely get data from KV
async function safeGet<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const value = await kvClient.get<T>(key);
    return value ?? defaultValue;
  } catch (error) {
    console.error(`Error getting data from KV for key ${key}:`, error);
    return defaultValue;
  }
}

// Helper function to safely set data in KV
async function safeSet<T>(key: string, value: T): Promise<boolean> {
  try {
    await kvClient.set(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting data in KV for key ${key}:`, error);
    return false;
  }
}

// Blog Posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = await safeGet<Record<string, BlogPost>>(BLOG_POSTS_KEY, {});
  return Object.values(posts);
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const posts = await safeGet<Record<string, BlogPost>>(BLOG_POSTS_KEY, {});
  return posts[id] || null;
}

export async function saveBlogPost(id: string, post: BlogPost): Promise<BlogPost> {
  const posts = await safeGet<Record<string, BlogPost>>(BLOG_POSTS_KEY, {});
  const updatedPosts = { ...posts, [id]: post };
  await safeSet(BLOG_POSTS_KEY, updatedPosts);
  return post;
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const posts = await safeGet<Record<string, BlogPost>>(BLOG_POSTS_KEY, {});
  if (posts[id]) {
    const { [id]: _, ...remainingPosts } = posts;
    return safeSet(BLOG_POSTS_KEY, remainingPosts);
  }
  return false;
}

// Media Files
export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export async function getMediaFiles(): Promise<MediaFile[]> {
  const files = await safeGet<Record<string, MediaFile>>(MEDIA_FILES_KEY, {});
  return Object.values(files);
}

export async function getMediaFileById(id: string): Promise<MediaFile | null> {
  const files = await safeGet<Record<string, MediaFile>>(MEDIA_FILES_KEY, {});
  return files[id] || null;
}

export async function saveMediaFile(file: Omit<MediaFile, 'id'>, id?: string): Promise<MediaFile> {
  const files = await safeGet<Record<string, MediaFile>>(MEDIA_FILES_KEY, {});
  const fileId = id || Date.now().toString();
  const newFile: MediaFile = {
    ...file,
    id: fileId,
    uploadedAt: file.uploadedAt || new Date().toISOString(),
  };
  
  const updatedFiles = { ...files, [fileId]: newFile };
  await safeSet(MEDIA_FILES_KEY, updatedFiles);
  return newFile;
}

export async function deleteMediaFile(id: string): Promise<boolean> {
  const files = await safeGet<Record<string, MediaFile>>(MEDIA_FILES_KEY, {});
  if (files[id]) {
    const { [id]: _, ...remainingFiles } = files;
    return safeSet(MEDIA_FILES_KEY, remainingFiles);
  }
  return false;
}

// Admin Settings
export async function getAdminSettings(): Promise<Record<string, any>> {
  return safeGet<Record<string, any>>(ADMIN_SETTINGS_KEY, {});
}

export async function saveAdminSettings(settings: Record<string, any>): Promise<boolean> {
  return safeSet(ADMIN_SETTINGS_KEY, settings);
}

// Site Customization
export async function getSiteCustomization(): Promise<Record<string, any>> {
  return safeGet<Record<string, any>>(SITE_CUSTOMIZATION_KEY, {});
}

export async function saveSiteCustomization(customization: Record<string, any>): Promise<boolean> {
  return safeSet(SITE_CUSTOMIZATION_KEY, customization);
}
