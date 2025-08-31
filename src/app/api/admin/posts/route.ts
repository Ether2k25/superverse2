import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';
import { getAllBlogPosts, createBlogPost, searchBlogPosts } from '@/lib/blog-storage-mongodb';

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value;
  if (!token) {
    return null;
  }
  return await verifyAdminToken(token);
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const published = searchParams.get('published');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];

    let posts;
    if (query || published !== null || tags.length > 0) {
      posts = await searchBlogPosts(query, {
        published: published === 'true' ? true : published === 'false' ? false : undefined,
        tags: tags.length > 0 ? tags : undefined,
      });
    } else {
      posts = await getAllBlogPosts();
    }

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const postData = await request.json();
    
    // Validate required fields
    if (!postData.title || !postData.slug || !postData.excerpt) {
      return NextResponse.json(
        { error: 'Title, slug, and excerpt are required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    if (!postData.slug) {
      postData.slug = postData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const newPost = await createBlogPost({
      title: postData.title,
      slug: postData.slug,
      excerpt: postData.excerpt,
      content: postData.content || '',
      tags: postData.tags || [],
      published: postData.published || false,
      featuredImage: postData.featuredImage,
      date: postData.date || new Date().toISOString().split('T')[0],
    });

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
