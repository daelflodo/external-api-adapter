import { DataSource } from 'typeorm';
import { env } from './env';

// Entities will be added in the next commit
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  entities: [],
  synchronize: true,
  logging: false,
});
