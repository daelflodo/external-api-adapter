import { DataSource } from 'typeorm';
import { MarketQuote } from '../modules/market/entities/MarketQuote.entity';
import { env } from './env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  entities: [MarketQuote],
  synchronize: true,
  logging: false,
  ssl: { rejectUnauthorized: false },
});
