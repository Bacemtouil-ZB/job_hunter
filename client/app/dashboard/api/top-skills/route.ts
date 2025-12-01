// client/app/dashboard/api/top-skills/route.ts
import { NextResponse } from 'next/server';
import { getTopSkills } from '@/lib/aggregation-queries';

export async function GET() {
  try {
    const data = await getTopSkills();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error in top-skills:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}