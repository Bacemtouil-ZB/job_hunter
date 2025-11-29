// client/app/dashboard/api/top-skills/route.ts
import { NextResponse } from 'next/server';
import { getTopSkills } from '@/lib/aggregation-queries';

export async function GET() {
  try {
    console.log('🎯 Fetching top skills data...');
    const data = await getTopSkills();
    console.log('✅ Top skills data received:', data);
    console.log('📝 Data type:', typeof data);
    console.log('📝 Is array:', Array.isArray(data));
    console.log('📝 Data length:', data?.length);
    console.log('📝 First item:', data?.[0]);
    
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('❌ Error in top-skills:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}