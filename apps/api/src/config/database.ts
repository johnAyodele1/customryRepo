import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from './env';
import { logger } from './logger';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDatabase = async (): Promise<void> => {
  try {
    let uri = env.MONGODB_URI;

    if (!uri || env.NODE_ENV === 'test') {
      if (!mongoMemoryServer) {
        mongoMemoryServer = await MongoMemoryServer.create();
      }
      uri = mongoMemoryServer.getUri();
      logger.info(`Using MongoMemoryServer at ${uri}`);
    }

    await mongoose.connect(uri);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
      mongoMemoryServer = null;
    }
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error('Error disconnecting MongoDB:', error);
  }
};
