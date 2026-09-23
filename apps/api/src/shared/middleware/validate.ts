import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../errors';

export const validateRequest = (schemas: {
  body?: AnyZodObject;
  params?: AnyZodObject;
  query?: AnyZodObject;
}) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new ValidationError('Invalid request payload', error.errors));
      }
      return next(error);
    }
  };
};
