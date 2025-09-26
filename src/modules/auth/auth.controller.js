import { RegisterDto } from "./auth.dto.js";
import authService from "./auth.service.js";
import { successResponse } from "../../utils/response.js";

class AuthController {
  async register(req, res, next) {
    const user = await authService.register(new RegisterDto(req.body));
    return successResponse(res, user, "User registered successfully", 201);
  }
}
export default new AuthController();
