import { getAccountInformation, getOpenPositions, getMetrics, isMetaStatsEnabled } from '@/lib/metaapi';
import { db } from '@/db/db';
import { tradingAccounts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function updateAccountStats() {
  console.log('Starting updateAccountStats function');
  try {
    const accounts = await db.select().from(tradingAccounts);
    console.log(`Found ${accounts.length} accounts to update`);

    for (const account of accounts) {
      try {
        console.log(`Updating stats for account: ${account.accountId}`);

        const accountInfo = await getAccountInformation(account.accountId);
        console.log('Account Information fetched successfully');

        const openTrades = await getOpenPositions(account.accountId);
        console.log(`Fetched ${openTrades.length} open trades`);

        let tradeStats = {};
        const metaStatsEnabled = await isMetaStatsEnabled(account.accountId);
        if (metaStatsEnabled) {
          try {
            tradeStats = await getMetrics(account.accountId);
            console.log('Trade Statistics fetched successfully');
          } catch (metaStatsError) {
            console.error(`Error fetching trade statistics for account ${account.accountId}:`, metaStatsError);
          }
        } else {
          console.log(`MetaStats not enabled for account ${account.accountId}`);
        }

        await db.update(tradingAccounts)
          .set({
            accountInfo,
            openTrades,
            metrics: tradeStats,
            updatedAt: new Date()
          })
          .where(eq(tradingAccounts.id, account.id));

        console.log(`Stats updated for account: ${account.accountId}`);
      } catch (accountError) {
        console.error(`Error updating account ${account.accountId}:`, accountError);
      }
    }

    console.log('All account stats updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Error updating account statistics:', error);
    throw error;
  }
}