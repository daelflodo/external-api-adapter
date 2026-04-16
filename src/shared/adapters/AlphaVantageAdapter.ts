import axios from 'axios';
import { env } from '../../config/env';
import { IFinancialApiAdapter, NormalizedQuote } from '../interfaces/IFinancialApiAdapter';

interface AlphaVantageGlobalQuoteRaw {
  '01. symbol': string;
  '02. open': string;
  '03. high': string;
  '04. low': string;
  '05. price': string;
  '06. volume': string;
  '07. latest trading day': string;
  '08. previous close': string;
  '09. change': string;
  '10. change percent': string;
}

interface AlphaVantageResponse {
  'Global Quote'?: AlphaVantageGlobalQuoteRaw;
  Note?: string;
  Information?: string;
}

export class AlphaVantageAdapter implements IFinancialApiAdapter {
  constructor(
    private readonly apiKey: string = env.alphaVantageApiKey,
    private readonly baseUrl: string = env.alphaVantageBaseUrl,
  ) {}

  async getGlobalQuote(symbol: string): Promise<NormalizedQuote> {
    try {
      const response = await axios.get<AlphaVantageResponse>(this.baseUrl, {
        params: { function: 'GLOBAL_QUOTE', symbol, apikey: this.apiKey },
        timeout: 10_000,
      });

      const data = response.data;

      if (data.Note) {
        const err = new Error(
          'Alpha Vantage rate limit reached. Please wait before retrying.',
        ) as Error & { statusCode: number };
        err.statusCode = 429;
        throw err;
      }

      if (data.Information) {
        const err = new Error(`Alpha Vantage API error: ${data.Information}`) as Error & {
          statusCode: number;
        };
        err.statusCode = 503;
        throw err;
      }

      const raw = data['Global Quote'];
      if (!raw || !raw['01. symbol']) {
        const err = new Error(`No data found for symbol: ${symbol}`) as Error & {
          statusCode: number;
        };
        err.statusCode = 404;
        throw err;
      }

      return {
        symbol: raw['01. symbol'],
        price: raw['05. price'],
        open: raw['02. open'],
        high: raw['03. high'],
        low: raw['04. low'],
        volume: raw['06. volume'],
        change: raw['09. change'],
        changePercent: raw['10. change percent'],
        previousClose: raw['08. previous close'],
        latestTradingDay: raw['07. latest trading day'],
      };
    } catch (error) {
      if ((error as Error & { statusCode?: number }).statusCode) throw error;

      const err = new Error(
        `Failed to reach Alpha Vantage: ${(error as Error).message}`,
      ) as Error & { statusCode: number };
      err.statusCode = 502;
      throw err;
    }
  }
}
