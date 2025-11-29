// client/app/dashboard/api/publication-trends/route.ts
import { NextResponse } from 'next/server';
import { getPublicationTrends } from '@/lib/aggregation-queries';

export async function GET() {
  try {
    console.log('📈 Fetching publication trends data...');
    const data = await getPublicationTrends();
    console.log('✅ Publication trends data received:', data);
    console.log('📝 Data type:', typeof data);
    console.log('📝 Is array:', Array.isArray(data));
    console.log('📝 Data length:', data?.length);
    console.log('📝 First item:', data?.[0]);
    
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('❌ Error in publication-trends:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}