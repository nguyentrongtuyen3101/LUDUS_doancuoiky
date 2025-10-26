import {createDto} from "./category.dto.js";
import {categoryService} from "./category.service.js";
import { successResponse,errorResponse } from "../../../utils/response.js";

export class categoryController {
    async create(req, res, next) {
        try {
            const category = await new categoryService().create(new createDto(req.body));
            return successResponse(res, category, "Tạo danh mục thành công", 201);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
    async update(req, res, next) {
        try {
            const category = await new categoryService().update(req.params.id, new createDto(req.body));
            return successResponse(res, category, "Cập nhật danh mục thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
        }
    async delete(req, res, next) {
        try {
            const result = await new categoryService().delete(req.params.id);
            return successResponse(res, result, "Xóa danh mục thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
        }
    async getAll(req, res, next) {
        try {
            const query = req.validatedQuery;
            const categories = await new categoryService().getAll(query);
            return successResponse(res, categories, "Lấy danh mục thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
}
