import { Router } from "express";
import AuthController from "../modules/auth/auth.controller.js";

const router = Router();

router.get("/me", AuthController.me);

export default router;