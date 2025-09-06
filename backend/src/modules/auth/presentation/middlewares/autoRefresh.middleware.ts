import { NextFunction, Response } from "express";

export const refreshAccessToken = (
  req: Express.Request,
  res: Response,
  next: NextFunction
) => {
  const session = req.session;

  if (!session) {
    return res.status(401).json({ message: "Session expired" });
  }

  next();
};
