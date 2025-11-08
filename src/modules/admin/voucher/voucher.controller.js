import {CreateCouponDto} from "./voucher.dto.js";
import {voucherService} from "./voucher.service.js";
import { successResponse,errorResponse } from "../../../utils/response.js";

export class voucherController {
    async create(req, res, next) {
        try {
            const voucher = await new voucherService().crate(new CreateCouponDto(req.body));
            return successResponse(res, voucher, "Tạo voucher thành công", 201);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
    async delete(req, res, next) {
        try {
            const result = await new voucherService().delete(req.params.id);
            return successResponse(res, result, "Xóa voucher thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
    async getAll(req, res, next) {
        try {
            const query = req.validatedQuery;
            const vouchers = await new voucherService().getAll(query);
            return successResponse(res, vouchers, "Lấy voucher thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
}