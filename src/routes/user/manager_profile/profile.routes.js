import { Router } from "express";
import {ProfileController} from "../../../modules/user/manager_profile/profile/profile.controller.js";

const router= Router();

router.get("/profile",new ProfileController().getProfile);
router.patch("/profile",new ProfileController().updateProfile);
router.post("/profile",new ProfileController().sendMailResetPassword);

export default router;