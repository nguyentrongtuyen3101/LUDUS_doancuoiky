import { RegisterDto,LoginDto,SendResetPasswordDto,ResetPasswordDto} from "./auth.dto.js";
import authService from "./auth.service.js";
import { successResponse,errorResponse } from "../../utils/response.js";
import { cookieOptions } from "../../config/cookie.config.js";

class AuthController {
  async register(req, res, next) {
    const user = await authService.register(new RegisterDto(req.body));
    return successResponse(res, user, "User registered successfully", 201);
  }

  async verifyEmail(req, res, next) {
      try {
        await authService.verifyEmail(req.query.token);
        return successResponse(res, null, "Email verified successfully", 200);
      }
      catch (error) {
        return errorResponse(res, error.message, error.status || 500);
      }
  }

  async googleCallback(req, res, next) {
    try {
      const { user, token } = req.user; 
      res.cookie("authToken", token, cookieOptions);
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    } catch (err) {
      return errorResponse(res, "Google login failed", 500);
    }
  }

  async facebookCallback(req, res, next) {
    try {
      const { user, token } = req.user; 
      res.cookie("authToken", token, cookieOptions);
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    } catch (err) {
      return errorResponse(res, "Facebook login failed", 500);
    }
  }
  async login(req, res, next) {
    const { user, token } = await authService.login(new LoginDto(req.body));
    res.cookie("authToken", token, cookieOptions);
    return res.json({ user });
    }

  async sendMailResetPassword(req, res, next) {
    const resetToken = await authService.sendMailResetPassword(new SendResetPasswordDto(req.body));
    return successResponse(res, resetToken, "Password reset email sent", 200);
    }

  async resetPassword(req, res, next) {
    const user = await authService.resetPassword(req.query.token, new ResetPasswordDto(req.body));
    return successResponse(res, user, "Password reset successfully", 200);
    }
}
export default new AuthController();
