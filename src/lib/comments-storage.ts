import fs from 'fs/promises';
import path from 'path';

// File paths for persistence
const DATA_DIR = path.join(process.cwd(), 'data');
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json');

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: {
    name: string;
    email?: string;
    isAnonymous: boolean;
  };
  createdAt: string;
  updatedAt: string;
  approved: boolean;
  replies?: Comment[];
}

export interface CommentCreateData {
  postId: string;
  content: string;
  author: {
    name: string;
    email?: string;
    phone?: string;
    isAnonymous: boolean;
  };
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Load comments from file
async function loadComments(): Promise<Comment[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(COMMENTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save comments to file
async function saveComments(comments: Comment[]): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2));
  } catch (error) {
    console.error('Error saving comments:', error);
    throw error;
  }
}

// Create new comment
export async function createComment(commentData: CommentCreateData): Promise<Comment> {
  const now = new Date().toISOString();
  
  const comment: Comment = {
    id: generateId(),
    postId: commentData.postId,
    content: commentData.content,
    author: {
      name: commentData.author.name,
      email: commentData.author.email,
      isAnonymous: commentData.author.isAnonymous,
    },
    createdAt: now,
    updatedAt: now,
    approved: true, // Auto-approve for now
    replies: [],
  };
  
  const comments = await loadComments();
  comments.push(comment);
  await saveComments(comments);
  
  return comment;
}

// Get comments by post ID
export async function getCommentsByPost(postId: string): Promise<Comment[]> {
  const comments = await loadComments();
  return comments
    .filter(comment => comment.postId === postId && comment.approved)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Get all comments
export async function getAllComments(): Promise<Comment[]> {
  return await loadComments();
}

// Update comment
export async function updateComment(id: string, updates: Partial<Comment>): Promise<Comment | null> {
  const comments = await loadComments();
  const commentIndex = comments.findIndex(comment => comment.id === id);
  
  if (commentIndex === -1) {
    return null;
  }
  
  comments[commentIndex] = {
    ...comments[commentIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  await saveComments(comments);
  return comments[commentIndex];
}

// Delete comment
export async function deleteComment(id: string): Promise<boolean> {
  const comments = await loadComments();
  const commentIndex = comments.findIndex(comment => comment.id === id);
  
  if (commentIndex === -1) {
    return false;
  }
  
  comments.splice(commentIndex, 1);
  await saveComments(comments);
  
  return true;
}

// Approve/reject comment
export async function moderateComment(id: string, approved: boolean): Promise<Comment | null> {
  return await updateComment(id, { approved });
}
