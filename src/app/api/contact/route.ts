import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/leads-storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, company, subject, message } = body;

    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create lead from contact form submission
    const fullName = `${firstName} ${lastName}`;
    await createLead({
      name: fullName,
      email,
      phone: company, // Store company in phone field for contact form leads
      source: 'contact',
    });

    // Here you could also send an email notification to admin
    // or integrate with other services like CRM, email marketing, etc.

    return NextResponse.json({ 
      success: true,
      message: 'Thank you for your message! We will get back to you within 24 hours.'
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
