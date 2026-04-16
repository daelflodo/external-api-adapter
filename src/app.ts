import express from 'express';
import morgan from 'morgan';

export function createApp(): express.Application {
  const app = express();

  app.use(morgan('dev'));
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Modules will be registered in the next commit

  return app;
}
