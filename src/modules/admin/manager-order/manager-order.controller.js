import {OrderService} from "./manager-order.service.js";
import { successResponse,errorResponse } from "../../../utils/response.js";

export class ManagerOrderController {
    async getAll(req, res, next) {
        try {
            const order = await new OrderService().getAll(req.validatedQuery);
            return successResponse(res, order, "Lấy đơn hàng thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
    async updateStatus(req, res, next) {
        try {
            const orderId = req.params.orderId;
            await new OrderService().updateStatus(orderId);
            return successResponse(res, null, "Cập nhật trạng thái đơn hàng thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
}