import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  published: boolean;
  featuredImage?: string;
  date: string;
  categoryId?: string;
  author: string | { name: string; email?: string; avatar?: string };
  views: number;
  likes: number;
  comments: Array<{
    id: string;
    author: string;
    content: string;
    date: string;
    approved: boolean;
  }>;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage?: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  published: { type: Boolean, default: false },
  featuredImage: { type: String },
  date: { type: String, required: true },
  categoryId: { type: String },
  author: { type: Schema.Types.Mixed, required: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: [{
    id: { type: String, required: true },
    author: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: String, required: true },
    approved: { type: Boolean, default: false }
  }],
  seo: {
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    keywords: [{ type: String }],
    ogImage: { type: String, default: null }
  }
}, {
  timestamps: true
});

// Create index for better search performance
BlogPostSchema.index({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' });
BlogPostSchema.index({ slug: 1 });
BlogPostSchema.index({ published: 1, date: -1 });
BlogPostSchema.index({ categoryId: 1 });

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
