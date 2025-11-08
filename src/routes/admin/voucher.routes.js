import { Router } from "express";
import {voucherController} from "../../modules/admin/voucher/voucher.controller.js";
import { validateQuery, paginationSchema } from "../../validators/queryValidator.js";

const router = Router();
router.post("/", new voucherController().create);
router.delete("/:id", new voucherController().delete);
router.get("/",validateQuery(paginationSchema), new voucherController().getAll);

export default router;