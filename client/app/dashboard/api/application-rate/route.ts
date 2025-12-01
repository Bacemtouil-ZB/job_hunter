// client/app/dashboard/api/application-rate/route.ts
import { NextResponse } from 'next/server';
import { getApplicationRate } from '@/lib/aggregation-queries';

export async function GET() {
  try {
    const data = await getApplicationRate();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error in application-rate:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}