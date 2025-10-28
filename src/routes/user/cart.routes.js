import { Router } from "express";
import {CartController} from "../../modules/user/cart/cart.controller.js";

const router=Router();
router.post("/:productVariantId",new CartController().create);
router.patch("/:productVariantId",new CartController().update);
router.delete("/:productVariantId",new CartController().deleteById);
router.delete("/",new CartController().deleteAll);
router.get("/",new CartController().getAll);
export default router;