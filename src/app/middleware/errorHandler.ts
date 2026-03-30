import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  if (err.message) {
    return res.status(400).json({ message: err.message });
  }

  res.status(500).json({ message: 'Internal server error' });
};