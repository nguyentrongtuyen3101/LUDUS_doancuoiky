import {createDto} from "./productVariant.dto.js";
import {productVariantService} from "./productVariant.service.js";
import { successResponse,errorResponse } from "../../../utils/response.js";

export class productVariantController {
    async create(req, res, next) {
        try {
            const productVariant = await new productVariantService().create(new createDto(req.body),req.params.id,req.file);
            return successResponse(res, productVariant, "Tạo biến thể sản phẩm thành công", 201);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
    async update(req, res, next) {
        try {
            const productVariant = await new productVariantService().update(new createDto(req.body),req.params.id,req.file);
            return successResponse(res, productVariant, "Cập nhật biến thể sản phẩm thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
    async delete(req, res, next) {
        try {
            const result = await new productVariantService().delete(req.params.id);
            return successResponse(res, result, "Xóa biến thể sản phẩm thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
    async getAll(req, res, next) {
        try {
            const productVariants = await new productVariantService().getAll(req.validatedQuery,req.params.productId);
            return successResponse(res, productVariants, "Lấy biến thể sản phẩm thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
}