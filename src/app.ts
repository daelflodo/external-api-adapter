import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import { MarketModule } from './modules/market/market.module';
import { errorMiddleware } from './shared/middleware/error.middleware';

export function createApp(): express.Application {
  const app = express();

  app.use(morgan('dev'));
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>External API Adapter</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
    .container { max-width: 700px; width: 100%; }
    h1 { font-size: 1.8rem; font-weight: 700; color: #f8fafc; margin-bottom: 0.4rem; }
    .subtitle { color: #94a3b8; margin-bottom: 2rem; font-size: 0.95rem; }
    .badge { display: inline-block; background: #22c55e; color: #fff; font-size: 0.7rem; font-weight: 600; padding: 2px 8px; border-radius: 999px; margin-left: 0.5rem; vertical-align: middle; }
    .section-title { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #64748b; margin-bottom: 0.75rem; }
    .endpoint { background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 1rem 1.25rem; margin-bottom: 0.75rem; display: flex; align-items: flex-start; gap: 1rem; }
    .method { background: #3b82f6; color: #fff; font-size: 0.7rem; font-weight: 700; padding: 3px 8px; border-radius: 5px; white-space: nowrap; margin-top: 2px; }
    .method.get { background: #3b82f6; }
    .path { font-family: 'Courier New', monospace; font-size: 0.9rem; color: #7dd3fc; font-weight: 600; }
    .desc { color: #94a3b8; font-size: 0.85rem; margin-top: 3px; }
    .try-link { font-size: 0.78rem; color: #38bdf8; text-decoration: none; margin-top: 4px; display: inline-block; }
    .try-link:hover { text-decoration: underline; }
    .footer { margin-top: 2rem; color: #475569; font-size: 0.8rem; text-align: center; }
    a { color: #38bdf8; }
  </style>
</head>
<body>
  <div class="container">
    <h1>External API Adapter <span class="badge">live</span></h1>
    <p class="subtitle">API REST que consume <strong>Alpha Vantage</strong> y expone cotizaciones bursátiles normalizadas con caché en PostgreSQL.</p>

    <p class="section-title">Endpoints disponibles</p>

    <div class="endpoint">
      <span class="method get">GET</span>
      <div>
        <div class="path">/health</div>
        <div class="desc">Estado del servidor</div>
        <a class="try-link" href="/health" target="_blank">→ probar</a>
      </div>
    </div>

    <div class="endpoint">
      <span class="method get">GET</span>
      <div>
        <div class="path">/external-data</div>
        <div class="desc">Cotizaciones en tiempo real de IBM, AAPL y MSFT desde Alpha Vantage</div>
        <a class="try-link" href="/external-data" target="_blank">→ probar</a>
      </div>
    </div>

    <div class="endpoint">
      <span class="method get">GET</span>
      <div>
        <div class="path">/external-data/quote/:symbol</div>
        <div class="desc">Cotización de cualquier símbolo bursátil (ej: TSLA, GOOGL, AMZN)</div>
        <a class="try-link" href="/external-data/quote/TSLA" target="_blank">→ probar con TSLA</a>
      </div>
    </div>

    <div class="endpoint">
      <span class="method get">GET</span>
      <div>
        <div class="path">/external-data/history</div>
        <div class="desc">Todas las cotizaciones guardadas en la base de datos local (caché)</div>
        <a class="try-link" href="/external-data/history" target="_blank">→ probar</a>
      </div>
    </div>

    <p class="footer">Node.js + TypeScript + Express + TypeORM + PostgreSQL &nbsp;·&nbsp; <a href="https://www.alphavantage.co/" target="_blank">Alpha Vantage API</a></p>
  </div>
</body>
</html>`);
  });

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const marketModule = new MarketModule();
  app.use('/external-data', marketModule.router);

  app.use(errorMiddleware);

  return app;
}
