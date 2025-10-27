import { Router } from "express";
import {newArrivalsController} from "../../modules/user/NEW ARRIVALS/newArrivals.controller.js";
import { validateQuery, paginationSchema } from "../../validators/queryValidator.js";

const router = Router();
router.get("/categories", new newArrivalsController().getAllCategoryAndSubcategory);
router.get("/products",validateQuery(paginationSchema), new newArrivalsController().getNewArrivals);
router.get("/products/:id", new newArrivalsController().getProductById);

export default router;