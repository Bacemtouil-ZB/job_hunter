// client/app/dashboard/api/job-type-distribution/route.ts
import { NextResponse } from 'next/server';
import { getJobTypeDistribution } from '@/lib/aggregation-queries';

export async function GET() {
  try {
    console.log('💼 Fetching job type distribution data...');
    const data = await getJobTypeDistribution();
    console.log('✅ Job type distribution data received:', data);
    console.log('📝 Data type:', typeof data);
    console.log('📝 Is array:', Array.isArray(data));
    console.log('📝 Data length:', data?.length);
    console.log('📝 First item:', data?.[0]);
    
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('❌ Error in job-type-distribution:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}