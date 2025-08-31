import { NextRequest, NextResponse } from 'next/server';
import { createComment, getCommentsByPost } from '@/lib/comments-storage';
import { createLead } from '@/lib/leads-storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, content, author, postTitle } = body;

    if (!postId || !content || !author?.name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the comment
    const comment = await createComment({
      postId,
      content,
      author: {
        name: author.name,
        email: author.email,
        phone: author.phone,
        isAnonymous: author.isAnonymous || false,
      },
    });

    // If user provided contact details, store as lead
    if (!author.isAnonymous && author.email) {
      try {
        await createLead({
          name: author.name,
          email: author.email,
          phone: author.phone,
          source: 'comment',
          postId,
          postTitle,
          commentId: comment.id,
        });
      } catch (error) {
        console.error('Error creating lead:', error);
        // Don't fail the comment creation if lead creation fails
      }
    }

    return NextResponse.json({ comment });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const comments = await getCommentsByPost(postId);
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
