// client/app/dashboard/api/job-type-distribution/route.ts
import { NextResponse } from 'next/server';
import { getJobTypeDistribution } from '@/lib/aggregation-queries';

export async function GET() {
  try {
    const data = await getJobTypeDistribution();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error in job-type-distribution:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}