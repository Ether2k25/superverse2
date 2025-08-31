import { NextRequest, NextResponse } from 'next/server';
import { getPublishedBlogPosts, searchBlogPosts } from '@/lib/blog-storage-mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const featured = searchParams.get('featured') === 'true';

    let posts;
    
    if (query || tags.length > 0) {
      // Use search functionality if query or tags are provided
      posts = await searchBlogPosts(query, {
        published: true, // Only return published posts for public API
        tags: tags.length > 0 ? tags : undefined,
      });
    } else {
      // Get all published posts
      posts = await getPublishedBlogPosts();
    }

    // Sort by date (newest first) - already sorted in getPublishedBlogPosts
    // posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // If featured is requested, return only the first post
    if (featured && posts.length > 0) {
      return NextResponse.json({ post: posts[0] });
    }

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
