import { Router } from "express";
import {PaymentMethodController} from "../../modules/admin/paymentMethod/paymentMethod.controller.js";

const router = Router();

router.get("/", new PaymentMethodController().getAllPaymentMethods);
router.patch("/:paymentMethodId", new PaymentMethodController().setIsActive);
router.get("/all", new PaymentMethodController().getAll);

export default router;