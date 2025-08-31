import { NextRequest, NextResponse } from 'next/server';
import { getPublicCustomization } from '@/lib/customization-storage';

export async function GET(request: NextRequest) {
  try {
    const customization = await getPublicCustomization();
    
    // Return customization data for public use with no-cache headers
    const response = NextResponse.json({ customization });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error fetching site customization:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
