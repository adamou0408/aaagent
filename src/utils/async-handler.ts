import { Request, Response, NextFunction } from "express";

/**
 * Wraps async route handlers to catch rejected promises
 * and forward them to Express error middleware.
 * Express 4 does not handle async rejections natively.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
