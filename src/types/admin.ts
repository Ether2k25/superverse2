export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor';
  createdAt: string;
  lastLogin?: string;
}

export interface AdminSession {
  user: AdminUser;
  token: string;
  expiresAt: string;
}

export interface BlogPostForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  published: boolean;
  featuredImage?: string;
  date: string;
}

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

export interface AdminStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  recentPosts: BlogPost[];
  storageUsed: number;
  totalFiles: number;
}

export interface AdminSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
  allowRegistration: boolean;
  maintenanceMode: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
}

import { BlogPost } from './blog';
