import { NextRequest, NextResponse } from 'next/server';
import { updateAccountStats } from '@/lib/updateAccountStats';

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === 'development' || req.headers.get('x-vercel-cron') === 'true') {
    try {
      const result = await updateAccountStats();
      return NextResponse.json(result);
    } catch (error) {
      console.error('Error updating account statistics:', error);
      return NextResponse.json({ error: 'Failed to update account statistics' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}