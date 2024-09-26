import MetaApi from 'metaapi.cloud-sdk';

// This function should only be used server-side
export function initializeMetaApi() {
  const MAIN_TOKEN = process.env.METAAPI_MAIN_TOKEN;
  if (!MAIN_TOKEN) {
    throw new Error('METAAPI_MAIN_TOKEN is not set in environment variables');
  }
  return new MetaApi(MAIN_TOKEN);
}

export async function getAccountInformation(accountId: string) {
  const api = initializeMetaApi();
  const account = await api.metatraderAccountApi.getAccount(accountId);
  await account.waitConnected();
  return account.getMetatraderAccountInformation();
}

export async function getOpenPositions(accountId: string) {
  const api = initializeMetaApi();
  const account = await api.metatraderAccountApi.getAccount(accountId);
  await account.waitConnected();
  return account.getPositions();
}

export async function getRecentTrades(accountId: string) {
  const api = initializeMetaApi();
  const account = await api.metatraderAccountApi.getAccount(accountId);
  await account.waitConnected();
  return account.getDeals();
}