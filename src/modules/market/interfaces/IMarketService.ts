import { MarketQuoteDto } from '../dto/market-quote.dto';

export interface IMarketService {
  getQuote(symbol: string): Promise<MarketQuoteDto>;
  getMultipleQuotes(symbols: string[]): Promise<MarketQuoteDto[]>;
  getCachedQuotes(): Promise<MarketQuoteDto[]>;
}
