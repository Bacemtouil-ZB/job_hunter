// client/app/dashboard/api/geographic-distribution/route.ts
import { NextResponse } from 'next/server';
import { getGeographicDistribution } from '@/lib/aggregation-queries';

export async function GET() {
  try {
    const data = await getGeographicDistribution();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error in geographic-distribution:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}