import { Request, Response, NextFunction } from 'express';
import { IMarketService } from './interfaces/IMarketService';

const DEFAULT_SYMBOLS = ['IBM', 'AAPL', 'MSFT'];

export class MarketController {
  constructor(private readonly service: IMarketService) {}

  getExternalData = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const quotes = await this.service.getMultipleQuotes(DEFAULT_SYMBOLS);
      res.json(quotes);
    } catch (error) {
      next(error);
    }
  };

  getQuoteBySymbol = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { symbol } = req.params;
      const quote = await this.service.getQuote(symbol);
      res.json(quote);
    } catch (error) {
      next(error);
    }
  };

  getCachedQuotes = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const quotes = await this.service.getCachedQuotes();
      res.json(quotes);
    } catch (error) {
      next(error);
    }
  };
}
