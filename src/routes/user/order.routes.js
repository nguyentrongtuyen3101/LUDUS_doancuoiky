import { Router } from "express";
import {OrderController} from "../../modules/user/order/order.controller.js";

const router=Router();
router.get("/payment-method",new OrderController().getAllPaymentMethod);
router.get("/voucher",new OrderController().getAllVoucher);
router.post("/checkout",new OrderController().CheckOut);
export default router;