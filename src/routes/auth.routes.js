import { Router } from "express";
import passport from "passport";
import AuthController from "../modules/auth/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/register", AuthController.register);
router.get("/verify", AuthController.verifyEmail);
router.post("/login", AuthController.login);
router.post("/send-reset-password", AuthController.sendMailResetPassword);
router.get("/redirect-reset-password", AuthController.redirectResetPassword);
router.patch("/reset-password", AuthController.resetPassword);
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
router.delete("/logout",authMiddleware(["User","Admin"]), AuthController.logout);
export default router;
