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
}