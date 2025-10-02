import { RegisterDto } from "./auth.dto.js";
import authService from "./auth.service.js";
import { successResponse,errorResponse } from "../../utils/response.js";

class AuthController {
  async register(req, res, next) {
    const user = await authService.register(new RegisterDto(req.body));
    return successResponse(res, user, "User registered successfully", 201);
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
}
export default new AuthController();
