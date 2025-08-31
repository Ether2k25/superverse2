import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, initializeDefaultAdmin } from '@/lib/admin-kv';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Admin Login Attempt ===');
    // Initialize default admin if it doesn't exist
    await initializeDefaultAdmin();
    
    const { username, password } = await request.json();
    console.log('Login attempt for username:', username);

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    console.log('Authenticating user...');
    const session = await authenticateAdmin(username, password);
    console.log('Authentication result:', session ? 'Success' : 'Failed');

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('Setting cookie with token...');
    // Set HTTP-only cookie for security
    const response = NextResponse.json({
      success: true,
      user: session.user,
      token: session.token, // Include token in response for debugging
    });

    response.cookies.set('admin-token', session.token, {
      httpOnly: true,
      secure: false, // Set to false for local development
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/', // Ensure cookie is available for all paths
    });

    console.log('Login successful, cookie set');
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
