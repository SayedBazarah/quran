import { Request, RequestHandler } from "express";
import { NotAuthenticatedError } from "@/shared/errors/not-authenticated.error";
import { TokenService } from "../infrastructure/auth.service";

export const signInHandler: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: "Not logged in" });
  }

  res.status(200).json({ message: "Logged in" });
};

export const currentUserHandler: RequestHandler = (req, res, next) => {
  if (!req.session || !req.user) {
    res.status(401).json({ error: "Not logged in" });
  }
  res.json(req.user);
};

export const refreshTokenHandler: RequestHandler = (req: Request, res) => {
  try {
    const token = req.session?.refreshToken;
    if (!token) throw new NotAuthenticatedError("يرجي تسجيل الدخول");
    const payload = TokenService.verifyRefreshToken(token);
    const { accessToken } = TokenService.generateTokens(payload);
    req.session.accessToken = accessToken;
    res.json({ accessToken });
  } catch (err) {
    throw new NotAuthenticatedError("يرجي تسجيل الدخول");
  }
};
