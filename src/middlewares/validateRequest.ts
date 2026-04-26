import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export const validateRequest = <T>(schema: ZodSchema<T>) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.body = schema.parse(req.body);
    next();
  };
};
