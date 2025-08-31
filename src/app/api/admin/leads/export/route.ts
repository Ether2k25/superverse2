import { NextRequest, NextResponse } from 'next/server';
import { getAllLeads, getLeadsBySource } from '@/lib/leads-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const source = searchParams.get('source') as 'comment' | 'newsletter' | 'contact' | null;

    let leads;
    if (source) {
      leads = await getLeadsBySource(source);
    } else {
      leads = await getAllLeads();
    }

    if (format === 'csv') {
      // Generate CSV
      const csvHeaders = 'Name,Email,Phone,Source,Post Title,Created At,Expires At\n';
      const csvRows = leads.map(lead => {
        const name = `"${lead.name.replace(/"/g, '""')}"`;
        const email = `"${lead.email || ''}"`;
        const phone = `"${lead.phone || ''}"`;
        const source = `"${lead.source}"`;
        const postTitle = `"${(lead.postTitle || '').replace(/"/g, '""')}"`;
        const createdAt = `"${new Date(lead.createdAt).toLocaleString()}"`;
        const expiresAt = `"${new Date(lead.expiresAt).toLocaleString()}"`;
        
        return `${name},${email},${phone},${source},${postTitle},${createdAt},${expiresAt}`;
      }).join('\n');

      const csvContent = csvHeaders + csvRows;
      const filename = `leads_${new Date().toISOString().split('T')[0]}.csv`;

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    } else if (format === 'json') {
      // Generate JSON
      const filename = `leads_${new Date().toISOString().split('T')[0]}.json`;
      
      return new NextResponse(JSON.stringify(leads, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Unsupported format. Use csv or json.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error exporting leads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
