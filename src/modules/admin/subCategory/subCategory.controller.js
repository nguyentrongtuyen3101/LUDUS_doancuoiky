import {createDto} from "./subCategory.dto.js";
import {subCategoryService} from "./subCategory.service.js";
import { successResponse,errorResponse } from "../../../utils/response.js";

export class subCategoryController {
    async create(req, res, next) {
        try {
            const subCategory = await new subCategoryService().create(new createDto(req.body),req.params.id);
            return successResponse(res, subCategory, "Tạo danh mục con thành công", 201);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
    async update(req, res, next) {
        try {
            const subCategory = await new subCategoryService().update(req.params.id, new createDto(req.body));
            return successResponse(res, subCategory, "Cập nhật danh mục con thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
        }
    async delete(req, res, next) {
        try {
            const result = await new subCategoryService().delete(req.params.id);
            return successResponse(res, result, "Xóa danh mục con thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
        }
    async getAllCategory(req, res, next) {
      try {
          const categories = await new subCategoryService().getAllCategory();
          return successResponse(res, categories, "Lấy danh mục thành công", 200);
      } catch (error) {
          return errorResponse(res, error.message, error.status || 500);
      }
  }
    async getAll(req, res, next) {
        try {
            const query = req.validatedQuery;
            const subCategories = await new subCategoryService().getAll(query);
            return successResponse(res, subCategories, "Lấy danh mục con thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
}