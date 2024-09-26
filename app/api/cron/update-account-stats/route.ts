import { NextRequest, NextResponse } from 'next/server';
import { updateAccountStats } from '@/lib/updateAccountStats';

export async function GET(req: NextRequest) {
  console.log('Cron job triggered for updating account stats');
  if (process.env.NODE_ENV === 'development' || req.headers.get('x-vercel-cron') === 'true') {
    try {
      console.log('Starting account stats update');
      const result = await updateAccountStats();
      console.log('Account stats update completed', result);
      return NextResponse.json(result);
    } catch (error) {
      console.error('Error updating account statistics:', error);
      return NextResponse.json({ error: 'Failed to update account statistics', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
  } else {
    console.log('Unauthorized access to cron job');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}