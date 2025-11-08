import { Router } from "express";
import {CouponController} from "../../modules/user/coupon/coupon.controller.js";

const router=Router();
router.get("/",new CouponController().getAll);
router.post("/:couponId",new CouponController().getCouponByCode);
export default router;