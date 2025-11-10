import { Router } from "express";
import {ManagerOrderController} from "../../modules/admin/manager-order/manager-order.controller.js";
import { validateQuery, paginationSchema } from "../../validators/queryValidator.js";

const router=Router();
router.get("/",validateQuery(paginationSchema),new ManagerOrderController().getAll);
router.patch("/:orderId",new ManagerOrderController().updateStatus);
export default router;