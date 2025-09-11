import { Router } from "express";
import passport from "passport";
import { currentUserHandler, signInHandler } from "./auth.controller";

import * as validators from "./validators";
import { accessTokenGuard } from "@/shared/guards/isAuthenticated";

const router = Router();

// Local login
router.post(
  "/sign-in",
  validators.signInValidator,
  passport.authenticate("local"),
  signInHandler
);

// Auth info
router.get("/me", accessTokenGuard, currentUserHandler);

// Logout
router.get("/sign-out", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.json({ message: "Logged out" });
  });
});

export default router;
