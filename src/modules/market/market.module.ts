import { Router } from 'express';
import { AlphaVantageAdapter } from '../../shared/adapters/AlphaVantageAdapter';
import { MarketRepository } from './market.repository';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';

export class MarketModule {
  readonly router: Router;

  constructor() {
    const adapter = new AlphaVantageAdapter();
    const repository = new MarketRepository();
    const service = new MarketService(adapter, repository);
    const controller = new MarketController(service);

    this.router = Router();
    this.registerRoutes(controller);
  }

  private registerRoutes(controller: MarketController): void {
    // GET /  top quotes for default symbols (IBM, AAPL, MSFT)
    this.router.get('/', controller.getExternalData);

    // GET /quote/:symbol -> single stock quote from Alpha Vantage
    this.router.get('/quote/:symbol', controller.getQuoteBySymbol);

    // GET /history -> all quotes stored in local DB cache
    this.router.get('/history', controller.getCachedQuotes);
  }
}
