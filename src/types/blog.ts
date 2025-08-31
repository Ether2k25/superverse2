export interface BlogPostSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string | null;
}

export interface BlogPostCreateData {
  title: string;
  slug?: string;
  excerpt: string;
  content?: string;
  tags?: string[];
  published?: boolean;
  featuredImage?: string;
  date?: string;
  categoryId?: string;
  featured?: boolean;
  seo?: BlogPostSEO;
}

export interface BlogPostBase {
  slug: string;
  title: string;
  published: boolean;
  date: string;
  tags: string[];
  excerpt: string;
  featuredImage?: string;
  content: string;
  categoryId?: string;
  featured?: boolean;
  author: string | {
    name: string;
    avatar?: string;
  };
  views: number;
  likes: number;
  comments: any[];
  seo: BlogPostSEO;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost extends BlogPostBase {
  id: string;
}

export interface NotionPage {
  object: string;
  id: string;
  created_time: string;
  last_edited_time: string;
  properties: {
    Name: {
      title: Array<{
        plain_text: string;
      }>;
    };
    Slug: {
      rich_text: Array<{
        plain_text: string;
      }>;
    };
    Published: {
      checkbox: boolean;
    };
    Date: {
      date: {
        start: string;
      };
    };
    Tags: {
      multi_select: Array<{
        name: string;
        color: string;
      }>;
    };
    Excerpt: {
      rich_text: Array<{
        plain_text: string;
      }>;
    };
    'Cover Image': {
      files: Array<{
        file?: {
          url: string;
        };
        external?: {
          url: string;
        };
      }>;
    };
  };
}

export interface FilterState {
  searchQuery: string;
  selectedTags: string[];
}
