import {createDto} from "./product.dto.js";
import {productService} from "./product.service.js";
import { successResponse,errorResponse } from "../../../utils/response.js";

export class productController {
    async create(req, res, next) {
        try {
            const product = await new productService().create(new createDto(req.body),req.params.id,req.file);
            return successResponse(res, product, "Tạo sản phẩm thành công", 201);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
    async update(req, res, next) {
        try {
            const product = await new productService().update(req.params.id,new createDto(req.body),req.file);
            return successResponse(res, product, "Cập nhật sản phẩm thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
    async delete(req, res, next) {
        try {
            const result = await new productService().delete(req.params.id);
            return successResponse(res, result, "Xóa sản phẩm thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
    async getAllCategoryAndSubcategory(req, res, next) {
        try {
            const categories = await new productService().getAllCategoryAndSubcategory();
            return successResponse(res, categories, "Lấy danh mục và danh mục con thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
    async getAll(req, res, next) {
        try {
            const products = await new productService().getAll(req.validatedQuery);
            return successResponse(res, products, "Lấy sản phẩm thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
    async uploadProdcutImageAray(req, res, next) {
        try {
            const result = await new productService().uploadProdcutImageAray(req.files, req.params.id);
            return successResponse(res, result, "Tải lên hình ảnh sản phẩm thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
}