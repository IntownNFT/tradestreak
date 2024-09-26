export interface TradingAccount {
  id: string;
  name: string;
  login: string;
  server: string;
  balance?: number;
  equity?: number;
  accountInfo?: {
    balance?: number;
    equity?: number;
    leverage?: number;
  };
  openTrades?: Array<{
    symbol: string;
    type: string;
    volume: number;
    openPrice: number;
    currentPrice: number;
    profit: number;
  }>;
}