import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';
import { sendError } from '../http/response';
import { logger } from '../../config/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(`Error on ${req.method} ${req.path}:`, err);

  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.code, err.message, err.details);
  }

  if (err.name === 'CastError') {
    return sendError(res, 400, 'INVALID_ID', 'Invalid resource identifier');
  }

  return sendError(
    res,
    500,
    'INTERNAL_SERVER_ERROR',
    'An unexpected error occurred on the server'
  );
};
