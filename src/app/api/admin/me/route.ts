import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-kv';

export async function GET(request: NextRequest) {
  try {
    console.log('=== Admin Auth Check ===');
    const token = request.cookies.get('admin-token')?.value;
    console.log('Token from cookie:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.log('No token provided, redirecting to login');
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    console.log('Verifying token...');
    const user = await verifyAdminToken(token);
    console.log('User verification result:', user ? 'Success' : 'Failed');
    
    if (!user) {
      console.log('Invalid token, redirecting to login');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    console.log('Authentication successful for user:', user.username);
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
