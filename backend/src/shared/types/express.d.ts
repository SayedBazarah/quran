import { ValidationError as ExpressValidatorError } from "express-validator";

declare global {
  namespace Express {
    interface Session {
      accessTokenIssuedAt: Date;
      refreshTokenIssuedAt: Date;
      expiresAt: Date;
    }
    interface Request {
      validatedParams?: Record<string, any>;
      validatedQuery?: Record<string, any>;
    }
    interface User {
      id: string;
      email: string;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    refreshToken?: string;
    accessToken?: string;
  }
}

export {};
