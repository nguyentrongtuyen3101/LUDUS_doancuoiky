import { Router } from "express";
import {productVariantController} from "../../modules/admin/productVariant/productVariant.controller.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { validateQuery, paginationSchema } from "../../validators/queryValidator.js";

const router = Router();
router.post("/create/:id",upload.single("variantImageUrl") ,new productVariantController().create);
router.patch("/update/:id",upload.single("variantImageUrl") ,new productVariantController().update);
router.delete("/delete/:id", new productVariantController().delete);
router.get("/all/:productId",validateQuery(paginationSchema), new productVariantController().getAll);

export default router;