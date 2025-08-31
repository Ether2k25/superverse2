import { NextRequest, NextResponse } from 'next/server';
import { getBlogPostBySlug, incrementPostViews } from '@/lib/blog-storage-mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const post = await getBlogPostBySlug(slug);
    
    // Ensure post exists and is published
    if (!post || !post.published) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Increment view count
    await incrementPostViews(post.id);

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
