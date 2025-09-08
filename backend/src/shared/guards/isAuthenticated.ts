import { Request, Response, NextFunction } from "express";
import { NotAuthenticatedError } from "../errors/not-authenticated.error";

export const accessTokenGuard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated()) {
    throw new NotAuthenticatedError("Error: not authenticated");
  }
  return next();
};
