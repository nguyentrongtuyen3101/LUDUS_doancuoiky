import { Router } from "express";
import {WishlistController} from "../../modules/user/wishlist/wishlist.controller.js";

const router=Router();
router.post("/:productVariantId",new WishlistController().addToWishlist);
router.delete("/:productVariantId",new WishlistController().removeFromWishlist);
router.delete("/",new WishlistController().deleteAll);
router.get("/",new WishlistController().getAll);
export default router;