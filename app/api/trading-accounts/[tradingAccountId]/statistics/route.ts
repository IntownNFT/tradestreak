import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from '@/db/db';
import { tradingAccounts, accountStatistics, projects } from '@/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export async function GET(req: NextRequest, { params }: { params: { tradingAccountId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { tradingAccountId } = params;
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  // Check if the user owns the trading account
  const [account] = await db
    .select()
    .from(tradingAccounts)
    .innerJoin(projects, eq(projects.id, tradingAccounts.projectId))
    .where(and(
      eq(tradingAccounts.id, tradingAccountId),
      eq(projects.userId, session.user.id)
    ))
    .limit(1);

  if (!account) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const statistics = await db
      .select()
      .from(accountStatistics)
      .where(and(
        eq(accountStatistics.tradingAccountId, tradingAccountId),
        gte(accountStatistics.timestamp, new Date(startDate!)),
        lte(accountStatistics.timestamp, new Date(endDate!))
      ))
      .orderBy(accountStatistics.timestamp);

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching account statistics:', error);
    return NextResponse.json({ error: 'Failed to fetch account statistics' }, { status: 500 });
  }
}