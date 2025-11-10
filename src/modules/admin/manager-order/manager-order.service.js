import prisma from "../../../prisma/client.js";
import { ServerException } from "../../../utils/errors.js";

export class OrderService {
    async getAll(query) {
        const where = query.status ?
            {
                status: query.status,
            } : {};
        const order = await prisma.order.findMany({
            where,
            skip: query.offset,
            take: query.limit,
            include: {
                orderDetails: true,
                payments: true,
            },
            orderBy: { orderDate: "desc" },
        });
        const total = await prisma.order.count(
            { where }
        );
        const totalPages = Math.ceil(total / query.limit);
        return {
            data: order,
            pagination: {
                total,
                totalPages,
                limit: query.limit,
                offset: query.offset,
            },
        };
    }
    async updateStatus(orderId) {
        let status;
        const order = await prisma.order.findUnique(
            {
                where: { id: orderId },
                include: { orderDetails: true }
            }
        );
        if (order.status === "Pending") {
            status = "Confirmed";
            for (const detail of order.orderDetails) {
                const productVariant = await prisma.productVariant.findUnique({
                    where: { id: detail.productVariantId }
                });
                await prisma.productVariant.updateMany({
                    where: { id: detail.productVariantId },
                    data: {
                        stockQuantity: {
                            decrement: detail.quantity
                        }
                    }
                });
                const sum = await prisma.productVariant.aggregate({
                    where: {
                        productId: productVariant.productId, // Dùng productId đã lấy ở bước 1
                        isActive: true
                    },
                    _sum: { stockQuantity: true }
                });

                await prisma.product.update({
                    where: { id: productVariant.productId },
                    data: { stockQuantity: sum._sum.stockQuantity || 0 }
                });
            }

        }
        else if (order.status === "Confirmed") status = "Processing";
        else if (order.status === "Processing") status = "Shipped";
        else if (order.status === "Shipped") status = "Delivered";
        else throw new ServerException("Đơn hàng không thể cập nhật trạng thái", 400);
        await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });
        return { message: "Cập nhật trạng thái đơn hàng thành công" };
    }
}