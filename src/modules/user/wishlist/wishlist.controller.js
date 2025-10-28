import {WishlistService} from "./wishlist.service.js";
import { successResponse,errorResponse } from "../../../utils/response.js";

export class WishlistController {
    async addToWishlist(req,res,next){
        try{
            const wishlistItem=await new WishlistService().addToWishlist(req.user.id,req.params.productVariantId);
            return successResponse(res,wishlistItem,"Thêm vào danh sách yêu thích thành công",201);
        }catch(error){
            return errorResponse(res,error.message,error.status||500);
        }
    }
    async removeFromWishlist(req,res,next){
        try{
            const wishlistItem=await new WishlistService().removeFromWishlist(req.user.id,req.params.productVariantId);
            return successResponse(res,wishlistItem,"Xóa khỏi danh sách yêu thích thành công",200);
        }catch(error){
            return errorResponse(res,error.message,error.status||500);
        }
    }
    async deleteAll(req,res,next){
        try{
            const wishlistdelete=await new WishlistService().deleteAll(req.user.id);
            return successResponse(res,wishlistdelete,"Xóa tất cả sản phẩm khỏi danh sách yêu thích thành công",200);
        }catch(error){
            return errorResponse(res,error.message,error.status||500);
        }
    }
    async getAll(req,res,next){
        try{
            const wishlistItems=await new WishlistService().getAll(req.user.id);
            return successResponse(res,wishlistItems,"Lấy danh sách yêu thích thành công",200);
        }catch(error){
            return errorResponse(res,error.message,error.status||500);
        }
    }
}