import { RegisterDto,LoginDto,SendResetPasswordDto} from "./auth.dto.js";
import authService from "./auth.service.js";
import { successResponse,errorResponse } from "../../utils/response.js";

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
      return successResponse(res, { user, token }, "Login with Google successful", 200);
    } catch (err) {
      return errorResponse(res, "Google login failed", 500);
    }
  }

  async facebookCallback(req, res, next) {
    try {
      const { user, token } = req.user; 
      return successResponse(res, { user, token }, "Login with Facebook successful", 200);
    } catch (err) {
      return errorResponse(res, "Facebook login failed", 500);
    }
  }
  async login(req, res, next) {
    const { user, token } = await authService.login(new LoginDto(req.body));
    return successResponse(res, { user, token }, "Login successful", 200);
    }
  async sendMailResetPassword(req, res, next) {
    const resetToken = await authService.sendMailResetPassword(new SendResetPasswordDto(req.body));
    return successResponse(res, resetToken, "Password reset email sent", 200);
    }
}
export default new AuthController();
