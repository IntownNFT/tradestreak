import { NextRequest, NextResponse } from 'next/server';
import { initializeMetaApi } from '@/lib/metaapi';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from '@/db/db';
import { tradingAccounts } from '@/db/schema';
import { updateAccountStats } from '@/lib/updateAccountStats';
import { AccountType } from 'metaapi.cloud-sdk'; // Import the correct type

const DEPLOYMENT_WAIT_TIME = 120000; // 2 minutes

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, login, password, server, projectId } = await req.json();

    const api = initializeMetaApi();
    const account = await api.metatraderAccountApi.createAccount({
      name,
      type: 'cloud' as AccountType, // Use the correct type
      login,
      password,
      server,
      platform: 'mt5',
      magic: 123456,
      metastatsApiEnabled: true
    });
    await account.deploy();
    await account.waitDeployed();

    console.log('Account created and deployed:', account.id);

    // Store account in our database
    const [newTradingAccount] = await db.insert(tradingAccounts).values({
      projectId,
      accountId: account.id,
      name: account.name,
      type: 'MetaTrader',
      login: account.login,
      server: account.server,
      accountInfo: {},
      openTrades: [],
      metrics: {}, // Initialize metrics field
    }).returning();

    console.log('Account stored in database:', newTradingAccount.id);

    // Wait for the account to be fully deployed before updating stats
    setTimeout(async () => {
      try {
        console.log('Updating account stats...');
        await updateAccountStats();
        console.log('Account stats updated successfully');
      } catch (updateError) {
        console.error('Error updating account statistics:', updateError);
      }
    }, DEPLOYMENT_WAIT_TIME);

    return NextResponse.json({ 
      success: true, 
      account: newTradingAccount
    });
  } catch (error) {
    console.error('Error creating MetaTrader account:', error);
    return NextResponse.json({ 
      error: 'Failed to create MetaTrader account', 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}