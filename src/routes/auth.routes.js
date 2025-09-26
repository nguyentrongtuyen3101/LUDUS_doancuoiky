import { Router } from "express";
import AuthController from "../modules/auth/auth.controller.js";

const router = Router();

router.post("/register", AuthController.register);

export default router;
