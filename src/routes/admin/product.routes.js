import { Router } from "express";
import {productController} from "../../modules/admin/product/product.controller.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { validateQuery, paginationSchema } from "../../validators/queryValidator.js";

const router = Router();
router.post("/create/:id",upload.single("file") ,new productController().create);

router.patch("/update/:id",upload.single("file") ,new productController().update);
router.delete("/delete/:id", new productController().delete);
router.get("/categories-subcategories", new productController().getAllCategoryAndSubcategory);
router.get("/all",validateQuery(paginationSchema), new productController().getAll);
router.post("/upload-images/:id", upload.array("files", 10), new productController().uploadProdcutImageAray);

export default router;