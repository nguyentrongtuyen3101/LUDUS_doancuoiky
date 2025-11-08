import {OrderDTO} from "./order.dto.js";
import {orderService} from "./order.service.js";
import { successResponse,errorResponse } from "../../../utils/response.js";

export class OrderController {
    async getAllPaymentMethod(req, res, next) {
        try {
            const paymentMethods = await new orderService().getAllPaymentMethod();
            return successResponse(res, paymentMethods, "Lấy phương thức thanh toán thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
    async getAllVoucher(req, res, next) {
        try {
            console.log("User ID từ token:", req.user.id);
            const vouchers = await new orderService().getAllVoucher(req.user.id);
            return successResponse(res, vouchers, "Lấy voucher thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
    async CheckOut(req, res, next) {
        try {
            const userId = req.user.id;
            const data = new OrderDTO(req.body);
            const newOrder = await new orderService().CheckOut(userId, data);
            return successResponse(res, newOrder, "Đặt hàng thành công", 201);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
}