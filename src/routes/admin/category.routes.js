import { Router } from "express";
import {categoryController} from "../../modules/admin/category/category.controller.js";

const router = Router();
router.post("/create", new categoryController().create);
router.patch("/update/:id", new categoryController().update);
router.delete("/delete/:id", new categoryController().delete);
router.get("/all", new categoryController().getAll);
export default router;
