import prisma from "../../../prisma/client.js";
import { ServerException, ClientException } from "../../../utils/errors.js";
import cloudinary from "../../../config/cloudinary.js";
import { unlink } from "fs/promises";

export class productVariantService {
    async create(data, productId, file) {
        const tempPath = file?.path;
        try {
            const existingProduct = await prisma.product.findUnique({ where: { id: productId } });
            if (!existingProduct) throw new ServerException("Sản phẩm không tồn tại", 404);
            if (await prisma.productVariant.findFirst({ where: { productId, size: data.size, color: data.color } })) throw new ClientException("Biến thể sản phẩm với kích thước và màu sắc này đã tồn tại", 400);
            if (!file) throw new ClientException("Hình ảnh sản phẩm là bắt buộc", 400);
            let imageUrl;
            try {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "productvariants",
                });
                imageUrl = result.secure_url;
            } catch (err) {
                throw new ServerException("Upload hình ảnh thất bại", 500);
            }

            await unlink(file.path).catch(() => { });
            const newProductVariant = await prisma.productVariant.create({
                data: {
                    productId: productId,
                    size: data.size,
                    color: data.color,
                    variantPrice: data.variantPrice,
                    stockQuantity: data.stockQuantity,
                    variantImageUrl: imageUrl
                }

            });
            if (newProductVariant.variantPrice < existingProduct.price) await prisma.product.update({
                where: { id: productId },
                data: { price: newProductVariant.variantPrice }
            });
            const sum = await prisma.productVariant.aggregate({
                where: { productId, isActive: true },
                _sum: { stockQuantity: true }
            });
            await prisma.product.update({
                where: { id: productId },
                data: { stockQuantity: sum._sum.stockQuantity || 0 }
            });
            return newProductVariant;
        } finally {
            if (tempPath) await unlink(tempPath).catch(() => { });
        }

    }
    async update(data, id, file) {
        const tempPath = file?.path;
        try {
            const existingVariant = await prisma.productVariant.findUnique({ where: { id } });
            if (!existingVariant) throw new ServerException("Biến thể sản phẩm không tồn tại", 404);
            if ((data.size && data.size !== existingVariant.size) || (data.color && data.color !== existingVariant.color)) {
                if (await prisma.productVariant.findFirst({ where: { productId: existingVariant.productId, size: data.size || existingVariant.size, color: data.color || existingVariant.color } })) throw new ClientException("Biến thể sản phẩm với kích thước và màu sắc này đã tồn tại", 400);
            }
            let imageUrl;
            if (file) {
                if (existingVariant.variantImageUrl) {
                    const segments = existingVariant.variantImageUrl.split("/");
                    const filename = segments[segments.length - 1];
                    const publicId = `productvariants/${filename.split(".")[0]}`;
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
            const updatedVariant = await prisma.productVariant.update({
                where: { id },
                data: {
                    size: data.size || existingVariant.size,
                    color: data.color || existingVariant.color,
                    variantPrice: data.variantPrice || existingVariant.variantPrice,
                    stockQuantity: data.stockQuantity || existingVariant.stockQuantity,
                    variantImageUrl: imageUrl || existingVariant.variantImageUrl
                }
            });
            const existingProduct = await prisma.product.findUnique({ where: { id: updatedVariant.productId } });
            if (updatedVariant.variantPrice < existingProduct.price) await prisma.product.update({
                where: { id: id },
                data: { price: updatedVariant.variantPrice }
            });
            const sum = await prisma.productVariant.aggregate({
                where: { productId: existingVariant.productId, isActive: true },
                _sum: { stockQuantity: true }
            });
            await prisma.product.update({
                where: { id: existingVariant.productId },
                data: { stockQuantity: sum._sum.stockQuantity || 0 }
            });
            return updatedVariant;
        } finally {
            if (tempPath) await unlink(tempPath).catch(() => { });
        }
    }
    async delete(id) {
        const existingVariant = await prisma.productVariant.findUnique({ where: { id } });
        if (!existingVariant) throw new ServerException("Biến thể sản phẩm không tồn tại", 404);

        await prisma.productVariant.update({
            where: { id },
            data: { isActive: false }
        });
        const minprice = await prisma.productVariant.findFirst({
            where: { productId: existingVariant.productId, isActive: true },
            orderBy: { variantPrice: "asc" }
        });
        await prisma.product.update({
            where: { id: existingVariant.productId },
            data: { price: minprice ? minprice.variantPrice : 0 }
        });
        const sum = await prisma.productVariant.aggregate({
            where: { productId: existingVariant.productId, isActive: true },
            _sum: { stockQuantity: true }
        });
        await prisma.product.update({
            where: { id: existingVariant.productId },
            data: { stockQuantity: sum._sum.stockQuantity || 0 }
        });
        return { message: "Xóa biến thể sản phẩm thành công" };
    }
    async getAll(query, productId) {
        const filters = { productId };

        if (query.size) filters.size = query.size;
        if (query.color) filters.color = query.color;

        const products = await prisma.productVariant.findMany({
            where: {
                ...filters,       
                isActive: true
            },
            skip: Number(query.offset) || 0,
            take: Number(query.limit) || 10,
            orderBy: { createdAt: "desc" },
        });

        const total = await prisma.productVariant.count({
            where: {
                ...filters,
                isActive: true
            }
        });

        const totalPages = Math.ceil(total / (Number(query.limit) || 10));

        return {
            data: products,
            pagination: {
                total,
                totalPages,
                limit: Number(query.limit) || 10,
                offset: Number(query.offset) || 0,
            },
        };
    }
}
