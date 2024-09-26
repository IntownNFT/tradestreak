import MetaApi, { MetaStats } from 'metaapi.cloud-sdk';

let metaApi: MetaApi | null = null;
let metaStats: MetaStats | null = null;

// This function should only be used server-side
export function initializeMetaApi() {
  if (!metaApi) {
    const MAIN_TOKEN = process.env.METAAPI_MAIN_TOKEN;
    if (!MAIN_TOKEN) {
      throw new Error('METAAPI_MAIN_TOKEN is not set in environment variables');
    }
    metaApi = new MetaApi(MAIN_TOKEN); // Removed region option
    metaStats = new MetaStats(MAIN_TOKEN); // Removed region option
  }
  return metaApi;
}

export function getMetaStats() {
  if (!metaStats) {
    throw new Error('MetaStats is not initialized');
  }
  return metaStats;
}

export async function getAccountInformation(accountId: string) {
  const api = initializeMetaApi();
  const account = await api.metatraderAccountApi.getAccount(accountId);
  await account.waitConnected();
  const connection = account.getRPCConnection();
  await connection.connect();
  return connection.getAccountInformation();
}

export async function getOpenPositions(accountId: string) {
  const api = initializeMetaApi();
  const account = await api.metatraderAccountApi.getAccount(accountId);
  await account.waitConnected();
  const connection = account.getRPCConnection();
  await connection.connect();
  return connection.getPositions();
}

export async function getMetrics(accountId: string) {
  const stats = getMetaStats();
  return stats.getMetrics(accountId);
}

export async function isMetaStatsEnabled(accountId: string) {
  const api = initializeMetaApi();
  const account = await api.metatraderAccountApi.getAccount(accountId);
  return account.metastatsApiEnabled;
}