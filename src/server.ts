import 'reflect-metadata';
import { AppDataSource } from './config/database';
import { createApp } from './app';
import { env } from './config/env';

async function bootstrap(): Promise<void> {
  await AppDataSource.initialize();
  console.log('Database initialised (PostgreSQL)');

  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
