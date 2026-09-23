import { createApp } from './app';
import { connectDatabase } from '../config/database';
import { env } from '../config/env';
import { logger } from '../config/logger';

const startServer = async () => {
  await connectDatabase();

  const app = createApp();

  app.listen(env.PORT, () => {
    logger.info(`Server listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
