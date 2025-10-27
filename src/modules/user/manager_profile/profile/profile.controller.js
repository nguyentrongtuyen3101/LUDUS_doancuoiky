import { UpdateDto} from "./profile.dto.js";
import {ProfileService} from "./profile.service.js";
import { successResponse,errorResponse } from "../../../../utils/response.js";

export class ProfileController{
    async getProfile(req,res,next){
        try{
            const userProfile= await new ProfileService().getProfile(req.user.id);
            return successResponse(res,userProfile,"Lấy thông tin cá nhân thành công",200);
        }
        catch(error){
            return errorResponse(res,error.message,error.status||500);
        }
    }
    async updateProfile(req,res,next){
        try{
            const updatedProfile= await new ProfileService().updateProfile(req.user.id,new UpdateDto(req.body));
            return successResponse(res,updatedProfile,"Cập nhật thông tin cá nhân thành công",200);
        }
        catch(error){
            return errorResponse(res,error.message,error.status||500);
        }
    }
    async sendMailResetPassword(req,res,next){
        try{
            await new ProfileService().sendMailResetPassword(req.user.email);
            return successResponse(res,null,"Gửi mail đặt lại mật khẩu thành công",200);
        }
        catch(error){
            return errorResponse(res,error.message,error.status||500);
        }
    }
}