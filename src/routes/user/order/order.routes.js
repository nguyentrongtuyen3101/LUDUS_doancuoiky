import { Router } from "express";
import {OrderController} from "../../../modules/user/order/order.controller.js";
import { validateQuery, paginationSchema } from "../../../validators/queryValidator.js";

const router=Router();
router.get("/payment-method",new OrderController().getAllPaymentMethod);
router.get("/voucher",new OrderController().getAllVoucher);
router.post("/checkout",new OrderController().CheckOut);
router.get("/",validateQuery(paginationSchema),new OrderController().getAllOrder);
router.patch("/:orderId",new OrderController().cancelled);
router.get("/product-variant/:productVariantId",new OrderController().getProductVariantById);
router.get("/:orderId",new OrderController().getOrderById);
export default router;