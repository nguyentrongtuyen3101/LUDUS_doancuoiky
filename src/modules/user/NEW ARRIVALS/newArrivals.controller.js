import {newArrivalsService} from "./newArrivals.service.js";
import { successResponse,errorResponse } from "../../../utils/response.js";

export class newArrivalsController {
    async getAllCategoryAndSubcategory(req, res, next) {
        try {
            const categories = await new newArrivalsService().getAllCategoryAndSubcategory();
            return successResponse(res, categories, "Lấy danh mục và danh mục con thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
    async getNewArrivals(req, res, next) {
        try {
            const products = await new newArrivalsService().getNewArrivals(req.validatedQuery);
            return successResponse(res, products, "Lấy sản phẩm mới về thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
    async getProductById(req, res, next) {
        try {
            const product = await new newArrivalsService().getProductById(req.params.id);
            return successResponse(res, product, "Lấy chi tiết sản phẩm thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
    async getAllImagesFromProduct(req, res, next) {
        try {
            const images = await new newArrivalsService().getAllImagesFromProduct(req.params.id);
            return successResponse(res, images, "Lấy tất cả hình ảnh từ sản phẩm thành công", 200);
        } catch (error) {
            return errorResponse(res, error.message, error.status || 500);
        }
    }
}