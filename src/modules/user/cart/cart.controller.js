import { CartDto} from "./cart.dto.js";
import {CartService} from "./cart.service.js";
import { successResponse,errorResponse } from "../../../utils/response.js";

export class CartController {
    async create(req,res,next){
        try{
            const cartDetailt=await new CartService().create(req.user.id,new CartDto(req.body),req.params.productVariantId);
            return successResponse(res,cartDetailt,"Thêm vào giỏ hàng thành công",201);
        }catch(error){
            return errorResponse(res,error.message,error.status||500);
        }
    }
    async update(req,res,next){
        try{
            const cartDetailt=await new CartService().update(req.user.id,new CartDto(req.body),req.params.productVariantId);
            return successResponse(res,cartDetailt,"Cập nhật giỏ hàng thành công",200);
        }catch(error){
            return errorResponse(res,error.message,error.status||500);
        }
    }
    async deleteById(req,res,next){
        try{
            const cartDetailt=await new CartService().deleteById(req.user.id,req.params.productVariantId);
            return successResponse(res,cartDetailt,"Xóa sản phẩm khỏi giỏ hàng thành công",200);
        }catch(error){
            return errorResponse(res,error.message,error.status||500);
        }
    }
    async deleteAll(req,res,next){
        try{
            const cartDetailt=await new CartService().deleteAll(req.user.id);
            return successResponse(res,cartDetailt,"Xóa tất cả sản phẩm khỏi giỏ hàng thành công",200);
        }catch(error){
            return errorResponse(res,error.message,error.status||500);
        }
    }
    async getAll(req,res,next){
        try{
            const cart=await new CartService().getAll(req.user.id);
            return successResponse(res,cart,"Lấy giỏ hàng thành công",200);
        }catch(error){
            return errorResponse(res,error.message,error.status||500);
        }
    }
}