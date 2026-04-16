export interface MarketQuoteDto {
  id?: number;
  symbol: string;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  change: number;
  changePercent: string;
  previousClose: number;
  latestTradingDay: string;
  trend: 'up' | 'down' | 'neutral';
  cachedAt?: Date;
}
