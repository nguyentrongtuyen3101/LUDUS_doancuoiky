import {PaymentMethodService} from "./paymentMethod.service.js";
import { successResponse,errorResponse } from "../../../utils/response.js";

export class PaymentMethodController{
    async getAllPaymentMethods(req,res,next){
        try{
            const paymentMethods= await new PaymentMethodService().getAllPaymentMethodsWhereIsActive();
            return successResponse(res,paymentMethods,"Lấy danh sách phương thức thanh toán thành công",200);
        }
        catch(error){
            return errorResponse(res,error.message,error.status||500);
        }
    }
    async setIsActive(req,res,next){
        try{
            const updatedPaymentMethod= await new PaymentMethodService().setIsActive(req.params.paymentMethodId);
            return successResponse(res,updatedPaymentMethod,"Cập nhật trạng thái phương thức thanh toán thành công",200);
        }
        catch(error){
            return errorResponse(res,error.message,error.status||500);
        }
    }

    async getAll(req,res,next){
        try{
            const paymentMethods= await new PaymentMethodService().getAll();
            return successResponse(res,paymentMethods,"Lấy danh sách tất cả phương thức thanh toán thành công",200);
        }
        catch(error){
            return errorResponse(res,error.message,error.status||500);
        }
    }
}