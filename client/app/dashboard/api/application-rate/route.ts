// client/app/dashboard/api/application-rate/route.ts
import { NextResponse } from 'next/server';
import { getApplicationRate } from '@/lib/aggregation-queries';

export async function GET() {
  try {
    console.log('📊 Fetching application rate data...');
    const data = await getApplicationRate();
    console.log('✅ Application rate data received:', data);
    console.log('📝 Data type:', typeof data);
    console.log('📝 Data keys:', data ? Object.keys(data) : 'null/undefined');
    
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('❌ Error in application-rate:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}