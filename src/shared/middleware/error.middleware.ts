import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

export function errorMiddleware(
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  console.error(`[${new Date().toISOString()}] ERROR ${statusCode}: ${message}`);

  res.status(statusCode).json({
    error: {
      statusCode,
      message,
    },
  });
}
