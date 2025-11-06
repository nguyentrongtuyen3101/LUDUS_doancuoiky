import prisma from "../../../prisma/client.js";
import { ServerException, ClientException } from "../../../utils/errors.js";
import cloudinary from "../../../config/cloudinary.js";
import { unlink } from "fs/promises";

export class productService {
    async create(data, id, file) {
        const tempPath = file?.path;
        try {
            if (!(await prisma.subcategory.findUnique({ where: { id } }))) throw new ServerException("Danh mục con không tồn tại", 404);
            if (await prisma.product.findFirst({ where: { productCode: data.productCode,isActive:true } })) throw new ClientException("Mã sản phẩm đã tồn tại", 400);
            if (!file) throw new ClientException("Hình ảnh sản phẩm là bắt buộc", 400);
            let imageUrl;
            try {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "products",
                });
                imageUrl = result.secure_url;
            } catch (err) {
                throw new ServerException("Upload hình ảnh thất bại", 500);
            }

            await unlink(file.path).catch(() => { });
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
                    subcategoryId: id
                }
            });
            return newProduct;
        } finally {
            if (tempPath) await unlink(tempPath).catch(() => { });
        }
    }
    async update(id, data, file) {
        const tempPath = file?.path;
        try {
            const existingProduct = await prisma.product.findUnique({ where: { id } });
            if (!existingProduct) throw new ServerException("Sản phẩm không tồn tại", 404);
            if (data.productCode && data.productCode !== existingProduct.productCode) {
                if (await prisma.product.findFirst({ where: { productCode: data.productCode,isActive:true } })) throw new ClientException("Mã sản phẩm đã tồn tại", 400);
            }
            let imageUrl;
            if (file) {
                if (existingProduct.imageUrl) {
                    const segments = existingProduct.imageUrl.split("/");
                    const filename = segments[segments.length - 1];
                    const publicId = `products/${filename.split(".")[0]}`;
                    try {
                        await cloudinary.uploader.destroy(publicId);
                    } catch (err) {
                        console.log("Xóa ảnh cũ thất bại:", err.message);
                    }
                }

                try {
                    const result = await cloudinary.uploader.upload(file.path, { folder: "products" });
                    imageUrl = result.secure_url;
                } catch (err) {
                    throw new ServerException("Upload hình ảnh thất bại", 500);
                }
            }
            if (file) await unlink(file.path).catch(() => { });
            const updatedProduct = await prisma.product.update({
                where: { id },
                data: {
                    name: data.name || existingProduct.name,
                    description: data.description || existingProduct.description,
                    price: data.price || existingProduct.price,
                    stockQuantity: data.stockQuantity || existingProduct.stockQuantity,
                    imageUrl: imageUrl || existingProduct.imageUrl,
                    productCode: data.productCode || existingProduct.productCode,
                    sizes: data.sizes || existingProduct.sizes,
                    colors: data.colors || existingProduct.colors,
                }
            });
            return updatedProduct;
        }
        finally {
            if (tempPath) await unlink(tempPath).catch(() => { });
        }
    }
    async delete(id) {
        const existingProduct = await prisma.product.findUnique({ where: { id } });
        if (!existingProduct) throw new ServerException("Sản phẩm không tồn tại", 404);
        await prisma.product.update({ where: { id }, data: { isActive: false } });
        await prisma.productVariant.updateMany({ where: { productId: id }, data: { isActive: false } });
        return;
    }
    async getAllCategoryAndSubcategory() {
        const categories = await prisma.category.findMany({
            include: {
                subcategories: true,
            },
        });
        return categories;
    }
    async getAll(query) {
        const where = query.q ?
            {
                OR: [
                    { name: { contains: query.q, mode: "insensitive" } },
                    { description: { contains: query.q, mode: "insensitive" } },
                    { productCode: { contains: query.q, mode: "insensitive" } }
                ]
            } : {};
        if (query.id) {
            if (!await prisma.subcategory.findUnique({ where: { id: query.id } })) throw new ServerException("Danh mục con không tồn tại", 404);
            where.subcategoryId = query.id;
        }
        where.isActive = true;
        const products = await prisma.product.findMany({
            where,
            skip: query.offset,
            take: query.limit,
            orderBy: { createdAt: "desc" },
        });
        const total = await prisma.product.count(
            { where }
        );
        const totalPages = Math.ceil(total / query.limit);
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

    async uploadProdcutImageAray(files, productId) {
        const uploadResults = [];

        for (const file of files) {
            let imageUrl;
            try {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "products",
                });
                imageUrl = result.secure_url;

                await prisma.productImage.create({
                    data: {
                        productId: productId,
                        imageUrl: imageUrl,
                    },
                });

                uploadResults.push(imageUrl);
            } catch (err) {
                throw new ServerException("Upload hình ảnh thất bại", 500);
            } finally {
                await unlink(file.path).catch(() => { });
            }
        }

        return uploadResults;
    }
    
}
