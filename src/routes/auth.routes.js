import { Router } from "express";
import passport from "passport";
import AuthController from "../modules/auth/auth.controller.js";

const router = Router();

router.post("/register", AuthController.register);

// Login Google
router.get("/google",passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res, next) => AuthController.googleCallback(req, res, next)
);

// Login Facebook
router.get("/facebook", passport.authenticate("facebook", { scope: ["public_profile","email"] }));
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {session: false, failureRedirect: "/login" }),
  (req, res, next) => AuthController.facebookCallback(req, res, next)
);

export default router;
