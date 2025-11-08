import {couponService} from "./coupon.service.js";
import { successResponse,errorResponse } from "../../../utils/response.js";

export class CouponController {
    async getAll(req, res, next) {
        try {
            const userId = req.user.id;
            const coupons = await new couponService().getAll(userId);
            return successResponse(res, coupons, "Lấy mã giảm giá thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
    async getCouponByCode(req, res, next) {
        try {
            const userId = req.user.id;
            const couponId = req.params.couponId;
            const usedCoupon = await new couponService().getCouponByCode(userId,couponId);
            return successResponse(res, usedCoupon, "Sử dụng mã giảm giá thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
}