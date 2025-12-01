// client/app/dashboard/api/average-salary/route.ts
import { NextResponse } from 'next/server';
import { getAverageSalaryByType } from '@/lib/aggregation-queries';

export async function GET() {
  try {
    const data = await getAverageSalaryByType();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error in average-salary:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}