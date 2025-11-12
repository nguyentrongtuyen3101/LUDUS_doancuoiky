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
            const ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress;
        const newOrder = await new orderService().CheckOut(userId, data, ipAddr);
        if (newOrder.redirectUrl) {
          return successResponse(res, { order: newOrder, redirectUrl: newOrder.redirectUrl }, "Đặt hàng thành công", 200);
        } else {
          return successResponse(res, { order: newOrder }, "Đặt hàng thành công", 200);
        }
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
    async getAllOrder(req, res, next) {
        try {
            const order = await new orderService().getAll(req.validatedQuery);
            return successResponse(res, order, "Lấy đơn hàng thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
    async cancelled(req, res, next) {
        try {
            const userId = req.user.id;
            const orderId = req.params.orderId;
            const note = req.body.note;
            await new orderService().cancelled(userId, orderId,note);
            return successResponse(res, null, "Hủy đơn hàng thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
    async getProductVariantById(req, res, next) {
        try {
            const productVariantId = req.params.productVariantId;
            const productVariant = await new orderService().getProductVariantById(productVariantId);
            return successResponse(res, productVariant, "Lấy biến thể sản phẩm thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }

    async getOrderById(req, res, next) {
        try {
            const orderId = req.params.orderId;
            const order = await new orderService().getOrderById(orderId);
            return successResponse(res, order, "Lấy đơn hàng thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
}