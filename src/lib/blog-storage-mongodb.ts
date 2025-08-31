import connectDB from './mongodb';
import BlogPost from '@/models/BlogPost';
import { BlogPost as BlogPostType, BlogPostCreateData } from '@/types/blog';

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

// Get all blog posts
export async function getAllBlogPosts(): Promise<BlogPostType[]> {
  await connectDB();
  const posts = await BlogPost.find({}).sort({ createdAt: -1 }).lean();
  return posts.map(post => ({
    ...post,
    id: post._id.toString(),
    _id: undefined
  })) as BlogPostType[];
}

// Get blog post by ID
export async function getBlogPostById(id: string): Promise<BlogPostType | null> {
  await connectDB();
  const post = await BlogPost.findById(id).lean();
  if (!post) return null;
  
  return {
    ...post,
    id: post._id.toString(),
    _id: undefined
  } as BlogPostType;
}

// Get blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPostType | null> {
  await connectDB();
  const post = await BlogPost.findOne({ slug }).lean();
  if (!post) return null;
  
  return {
    ...post,
    id: post._id.toString(),
    _id: undefined
  } as BlogPostType;
}

// Create new blog post
export async function createBlogPost(postData: BlogPostCreateData): Promise<BlogPostType> {
  await connectDB();
  
  // Check if slug already exists
  const existingPost = await BlogPost.findOne({ slug: postData.slug });
  if (existingPost) {
    throw new Error('A post with this slug already exists');
  }

  const newPostData = {
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

  const post = await BlogPost.create(newPostData);
  
  return {
    ...post.toObject(),
    id: post._id.toString(),
    _id: undefined
  } as BlogPostType;
}

// Update blog post
export async function updateBlogPost(id: string, updateData: Partial<BlogPostCreateData>): Promise<BlogPostType | null> {
  await connectDB();
  
  // Check if slug already exists (excluding current post)
  if (updateData.slug) {
    const existingPost = await BlogPost.findOne({ slug: updateData.slug, _id: { $ne: id } });
    if (existingPost) {
      throw new Error('A post with this slug already exists');
    }
  }

  const post = await BlogPost.findByIdAndUpdate(
    id,
    { ...updateData, updatedAt: new Date() },
    { new: true }
  ).lean();
  
  if (!post) return null;
  
  return {
    ...post,
    id: post._id.toString(),
    _id: undefined
  } as BlogPostType;
}

// Delete blog post
export async function deleteBlogPost(id: string): Promise<boolean> {
  await connectDB();
  const result = await BlogPost.findByIdAndDelete(id);
  return !!result;
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
): Promise<BlogPostType[]> {
  await connectDB();
  
  let searchQuery: any = {};
  
  // Text search
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  // Published filter
  if (filters.published !== undefined) {
    searchQuery.published = filters.published;
  }
  
  // Category filter
  if (filters.categoryId) {
    searchQuery.categoryId = filters.categoryId;
  }
  
  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    searchQuery.tags = { $in: filters.tags };
  }
  
  // Date filters
  if (filters.dateFrom || filters.dateTo) {
    searchQuery.date = {};
    if (filters.dateFrom) {
      searchQuery.date.$gte = filters.dateFrom;
    }
    if (filters.dateTo) {
      searchQuery.date.$lte = filters.dateTo;
    }
  }
  
  const posts = await BlogPost.find(searchQuery)
    .sort({ date: -1 })
    .lean();
  
  return posts.map(post => ({
    ...post,
    id: post._id.toString(),
    _id: undefined
  })) as BlogPostType[];
}

// Get published blog posts (for public API)
export async function getPublishedBlogPosts(): Promise<BlogPostType[]> {
  await connectDB();
  const posts = await BlogPost.find({ published: true })
    .sort({ date: -1 })
    .lean();
  
  return posts.map(post => ({
    ...post,
    id: post._id.toString(),
    _id: undefined
  })) as BlogPostType[];
}

// Increment post views
export async function incrementPostViews(id: string): Promise<void> {
  await connectDB();
  await BlogPost.findByIdAndUpdate(id, { $inc: { views: 1 } });
}

// Toggle post like
export async function togglePostLike(id: string): Promise<number> {
  await connectDB();
  const post = await BlogPost.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    { new: true }
  );
  
  return post?.likes || 0;
}

// Toggle post published status
export async function togglePostPublished(id: string): Promise<BlogPostType | null> {
  await connectDB();
  const post = await BlogPost.findById(id);
  if (!post) return null;
  
  post.published = !post.published;
  await post.save();
  
  return {
    ...post.toObject(),
    id: post._id.toString(),
    _id: undefined
  } as BlogPostType;
}
