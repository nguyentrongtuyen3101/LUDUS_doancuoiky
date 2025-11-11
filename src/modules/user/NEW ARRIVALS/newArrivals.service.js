import prisma from "../../../prisma/client.js"; 
import { ServerException ,ClientException} from "../../../utils/errors.js";

export class newArrivalsService{
    async getAllCategoryAndSubcategory(){
        const categories = await prisma.category.findMany({
            include: {
                subcategories: true,
            },
        });
        return categories;
    }
    async getNewArrivals(query){
        const where=query.q?
        {
            OR:[
                {name: { contains: query.q, mode: "insensitive" }},
                {description: { contains: query.q, mode: "insensitive" }},
                {productCode: { contains: query.q, mode: "insensitive" }}
            ]
        }:{};
        if(query.id){
            if(!await prisma.subcategory.findUnique({where:{id:query.id}})) throw new ServerException("Danh mục con không tồn tại", 404);
            where.subcategoryId=query.id;
        }
        if(query.minPrice&&query.maxPrice){
            where.price={
                gte: Number(query.minPrice),
                lte: Number(query.maxPrice)
            };
        }
        where.isActive=true;
        const products = await prisma.product.findMany({
            where,
            skip: query.offset,
            take: query.limit,
            orderBy: { createdAt: "desc" },
        });
        const total= await prisma.product.count(
            {where}
        );
        const totalPages = Math.ceil(total/ query.limit);
        return {
            data: products,
            pagination: {
                total,
                totalPages,
                limit: query.limit,
                offset: query.offset,
            },
        };
    }

    async getProductById(id){
        const product = await prisma.product.findUnique({
            where: { id,isActive:true },
            include: {productVariants: true}
        });
        if(!product) throw new ClientException("Sản phẩm không tồn tại",404);
        return product;
    }

    async getAllImagesFromProduct(productId){
        const images = await prisma.productImage.findMany({
            where: { productId },
        });
        return images;
    }
}