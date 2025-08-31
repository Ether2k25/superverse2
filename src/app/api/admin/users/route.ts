import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, getAllAdminUsers, createAdminUser } from '@/lib/admin-auth';

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

    const users = await getAllAdminUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can create new users
    if (admin.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const userData = await request.json();
    
    // Validate required fields
    if (!userData.username || !userData.email || !userData.password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    const newUser = await createAdminUser({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'editor',
    });

    if (!newUser) {
      return NextResponse.json(
        { error: 'User already exists or creation failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
