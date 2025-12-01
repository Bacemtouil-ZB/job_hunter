// client/app/dashboard/api/publication-trends/route.ts
import { NextResponse } from 'next/server';
import { getPublicationTrends } from '@/lib/aggregation-queries';

export async function GET() {
  try {
    const data = await getPublicationTrends();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error in publication-trends:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}