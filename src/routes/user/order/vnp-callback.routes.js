import { Router } from "express";
import { handleVnpayIpn, handleVnpayReturn } from "../../../utils/vnpay.handler.js";

const router=Router();
router.get("/vnpay_return", handleVnpayReturn);
router.get("/vnpay_ipn", handleVnpayIpn);
export default router;