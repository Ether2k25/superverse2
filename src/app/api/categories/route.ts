import { NextRequest, NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/categories-storage-mongodb';

export async function GET(request: NextRequest) {
  try {
    const categories = await getAllCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
