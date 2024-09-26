import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from '@/db/db';
import { tradingAccounts, projects } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(req: NextRequest, { params }: { params: { tradingAccountId: string } }) {
  const session = await getServerSession(authOptions as any);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { tradingAccountId } = params;

  try {
    const [account] = await db
      .select({
        metrics: tradingAccounts.metrics
      })
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

    return NextResponse.json(account.metrics);
  } catch (error) {
    console.error('Error fetching account metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch account metrics' }, { status: 500 });
  }
}