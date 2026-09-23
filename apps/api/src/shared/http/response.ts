import { Response } from 'express';
import { ApiResponse, PaginationMeta } from '@customry/contracts';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  pagination?: PaginationMeta
) => {
  const payload: ApiResponse<T> = {
    success: true,
    data,
    ...(pagination && { pagination }),
  };
  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown
) => {
  const payload: ApiResponse<never> = {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  };
  return res.status(statusCode).json(payload);
};
