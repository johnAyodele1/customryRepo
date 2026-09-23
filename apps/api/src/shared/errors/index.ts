export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND') {
    super(404, code, message);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation error', details?: unknown) {
    super(400, 'VALIDATION_ERROR', message, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required', code = 'UNAUTHENTICATED') {
    super(401, code, message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied', code = 'UNAUTHORIZED') {
    super(403, code, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict', code = 'CONFLICT') {
    super(409, code, message);
  }
}

export class InsufficientStockError extends AppError {
  constructor(message = 'Insufficient stock available') {
    super(400, 'INSUFFICIENT_STOCK', message);
  }
}
