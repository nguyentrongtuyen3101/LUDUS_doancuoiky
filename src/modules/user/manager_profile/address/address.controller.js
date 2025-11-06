import { CreateDto} from "./address.dto.js";
import {AddressService} from "./address.service.js";
import { successResponse,errorResponse } from "../../../../utils/response.js";

export class AddressController{
    async createAddress(req,res,next){
        try{
            const newAddress= await new AddressService().createAddress(req.user.id,new CreateDto(req.body));
            return successResponse(res,newAddress,"Tạo địa chỉ thành công",201);
        }
        catch(error){
            return errorResponse(res,error.message,error.status||500);
        }
    }
    async getAddresses(req,res,next){
        try{
            const addresses= await new AddressService().getAddresses(req.user.id);
            return successResponse(res,addresses,"Lấy danh sách địa chỉ thành công",200);
        }
        catch(error){
            return errorResponse(res,error.message,error.status||500);
        }
    }
    async getById(req,res,next){
        try{
            const address= await new AddressService().getById(req.user.id,req.params.addressId);
            return successResponse(res,address,"Lấy địa chỉ thành công",200);
        }
        catch(error){
            return errorResponse(res,error.message,error.status||500);
        }
    }
    async deleteAddress(req,res,next){
        try{
            await new AddressService().deleteAddress(req.user.id,req.params.addressId);
            return successResponse(res,null,"Xoá địa chỉ thành công",200);
        }
        catch(error){
            return errorResponse(res,error.message,error.status||500);
        }
    }
    async updateAddress(req,res,next){
        try{
            const updatedAddress= await new AddressService().update(req.user.id,req.params.addressId,new CreateDto(req.body));
            return successResponse(res,updatedAddress,"Cập nhật địa chỉ thành công",200);
        }
        catch(error){
            return errorResponse(res,error.message,error.status||500);
        }
    }
    async setDefaultAddress(req,res,next){
        try{
            const updatedAddress= await new AddressService().setDefaultAddress(req.user.id,req.params.addressId);
            return successResponse(res,updatedAddress,"Đặt địa chỉ mặc định thành công",200);
        }
        catch(error){
            return errorResponse(res,error.message,error.status||500);
        }
    }
}   