import { Request, Response, NextFunction } from "express";
import { NotAuthenticatedError } from "../errors/not-authenticated.error";

export const accessTokenGuard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("--- Logs ---", {
    session: req.session,
    user: req.user,
  });
  if (!req.session) {
    throw new NotAuthenticatedError("Error: not authenticated");
  }
  return next();
};
