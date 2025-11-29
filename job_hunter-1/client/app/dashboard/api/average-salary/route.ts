// client/app/dashboard/api/average-salary/route.ts
import { NextResponse } from 'next/server';
import { getAverageSalaryByType } from '@/lib/aggregation-queries';

export async function GET() {
  try {
    console.log('💰 Fetching average salary data...');
    const data = await getAverageSalaryByType();
    console.log('✅ Average salary data received:', data);
    console.log('📝 Data type:', typeof data);
    console.log('📝 Is array:', Array.isArray(data));
    console.log('📝 Data length:', data?.length);
    
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('❌ Error in average-salary:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}