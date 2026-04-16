import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import { MarketModule } from './modules/market/market.module';
import { errorMiddleware } from './shared/middleware/error.middleware';

export function createApp(): express.Application {
  const app = express();

  app.use(morgan('dev'));
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const marketModule = new MarketModule();
  app.use('/external-data', marketModule.router);

  app.use(errorMiddleware);

  return app;
}
