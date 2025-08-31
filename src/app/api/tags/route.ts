import { NextRequest, NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/admin-data';

export async function GET(request: NextRequest) {
  try {
    const allPosts = await getAllBlogPosts();
    
    // Get all published posts
    const publishedPosts = allPosts.filter(post => post.published);
    
    // Extract unique tags from all published posts
    const allTags = publishedPosts.reduce((tags: string[], post) => {
      if (post.tags) {
        post.tags.forEach(tag => {
          if (!tags.includes(tag)) {
            tags.push(tag);
          }
        });
      }
      return tags;
    }, []);

    // Sort tags alphabetically
    allTags.sort();

    return NextResponse.json({ tags: allTags });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
