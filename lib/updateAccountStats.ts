import { initializeMetaApi } from '@/lib/metaapi';
import { db } from '@/db/db';
import { tradingAccounts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function updateAccountStats() {
  try {
    const api = initializeMetaApi();
    const accounts = await db.select().from(tradingAccounts);

    for (const account of accounts) {
      try {
        console.log(`Updating stats for account: ${account.id}`);
        const metaApiAccount = await api.metatraderAccountApi.getAccount(account.accountId);
        
        // Get RPC connection
        const connection = metaApiAccount.getRPCConnection();
        await connection.connect();
        await connection.waitSynchronized();

        console.log('Account connected, fetching data...');

        // Fetch account information using RPC connection
        const accountInfo = await connection.getAccountInformation();
        console.log('Account Information:', accountInfo);

        // Fetch open trades using RPC connection
        const openTrades = await connection.getPositions();
        console.log('Open Trades:', openTrades);

        // Update the trading account with the new stats
        await db.update(tradingAccounts)
          .set({
            accountInfo,
            openTrades,
            updatedAt: new Date()
          })
          .where(eq(tradingAccounts.id, account.id));

        console.log(`Stats updated for account: ${account.id}`);

        // Close the connection
        await connection.close();
      } catch (accountError) {
        console.error(`Error updating account ${account.id}:`, accountError);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating account statistics:', error);
    throw error;
  }
}