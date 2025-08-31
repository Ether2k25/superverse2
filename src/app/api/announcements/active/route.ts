import { NextResponse } from 'next/server';
import { getActiveAnnouncement } from '@/lib/announcements-storage';

export async function GET() {
  try {
    const announcement = getActiveAnnouncement();
    return NextResponse.json({ announcement });
  } catch (error) {
    console.error('Error fetching active announcement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active announcement' },
      { status: 500 }
    );
  }
}
