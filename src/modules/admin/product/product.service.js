import prisma from "../../../prisma/client.js"; 
import { ServerException ,ClientException} from "../../../utils/errors.js";
import { uploadToR2 } from "../../../utils/r2Upload.util.js";

export class productService{
    async create (data,id,file) {
        if(!(await prisma.subcategory.findUnique({where:{id}}))) throw new ServerException("Danh mục con không tồn tại", 404);

        if (!file) throw new ClientException("Vui lòng tải lên ảnh sản phẩm", 400);
        if (!/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.originalname)) throw new ClientException("Định dạng hình ảnh không hợp lệ", 400);
    
        let imageUrl = await uploadToR2(file);
        const newProduct = await prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                stockQuantity: data.stockQuantity,
                imageUrl: imageUrl,
                productCode: data.productCode,
                sizes: data.sizes,
                colors: data.colors,
                subcategoryId:id
            }
        });
        return newProduct;
    }
}