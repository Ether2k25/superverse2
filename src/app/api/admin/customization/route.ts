import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';
import { getSiteSettings, updateSiteSettings } from '@/lib/admin-storage-mongodb';

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

    const customization = await getSiteSettings();
    return NextResponse.json({ customization });
  } catch (error) {
    console.error('Error fetching site customization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    const updatedCustomization = await updateSiteSettings(updates);
    
    return NextResponse.json({ customization: updatedCustomization });
  } catch (error) {
    console.error('Error updating site customization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can reset customization
    if (admin.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Reset to default settings by creating new default settings
    const defaultSettings = await getSiteSettings();
    const resetCustomization = await updateSiteSettings(defaultSettings);
    return NextResponse.json({ customization: resetCustomization });
  } catch (error) {
    console.error('Error resetting site customization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
