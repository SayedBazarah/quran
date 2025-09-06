import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import {
  sessionMiddleware,
  initializePassport,
} from "./modules/auth/infrastructure/session";
import {
  globalErrorHandlingMiddleware,
  globalNotFoundMiddleware,
} from "./shared/middlewares";
import { redisClient } from "./shared/redis/client";
import AppRoute from "./shared/global-route";

const app = express();

app.use(
  cors({
    origin: "http://localhost:8083", // your Next.js frontend
    credentials: true, // allow cookies
  })
);
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(
  "/media",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    next();
  },
  express.static("media")
);

// Session middleware must come before passport
app.use(sessionMiddleware);
app.use(...initializePassport);

app.get("/", async (req, res) => {
  const message = await redisClient.get("test");

  res.json({ message });
});

app.use("/api", AppRoute);

app.use(globalNotFoundMiddleware);
app.use(globalErrorHandlingMiddleware);

export default app;
