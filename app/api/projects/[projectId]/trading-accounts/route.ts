import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from '@/db/db';
import { projects, tradingAccounts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { projectId } = params;

  // Check if the user owns the project
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const accounts = await db
      .select()
      .from(tradingAccounts)
      .where(eq(tradingAccounts.projectId, projectId));

    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Error fetching trading accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch trading accounts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { projectId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { projectId } = params;
  const { name, login, server, accountId } = await req.json();

  // Check if the user owns the project
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const [newTradingAccount] = await db.insert(tradingAccounts).values({
      projectId,
      accountId,
      name,
      type: 'MetaTrader',
      login,
      server
    }).returning();

    return NextResponse.json({ success: true, account: newTradingAccount });
  } catch (error) {
    console.error('Error creating trading account:', error);
    return NextResponse.json({ error: 'Failed to create trading account' }, { status: 500 });
  }
}