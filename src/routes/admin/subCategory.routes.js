import { Router } from "express";
import {subCategoryController} from "../../modules/admin/subCategory/subCategory.controller.js";
import { validateQuery, paginationSchema } from "../../validators/queryValidator.js";

const router = Router();
router.post("/create/:id", new subCategoryController().create);
router.patch("/update/:id", new subCategoryController().update);
router.delete("/delete/:id", new subCategoryController().delete);
router.get("/categories", new subCategoryController().getAllCategory);
router.get("/all",validateQuery(paginationSchema), new subCategoryController().getAll);
export default router;