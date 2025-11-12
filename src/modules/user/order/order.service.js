import prisma from "../../../prisma/client.js";
import { ServerException } from "../../../utils/errors.js";
import { buildVnpayUrl } from "../../../config/vnpay.config.js";

export class orderService {
    async getAllPaymentMethod() {
        const paymentMethods = await prisma.paymentMethod.findMany({
            where: {
                isActive: true
            }
        });
        return paymentMethods;
    }
    async getAllVoucher(userId) {
        const vouchers = await prisma.voucherWithUser.findMany({
            where: {
                userId,
                isUse: false,
            },
            include: {
                coupon: true,
            }
        });

        return vouchers;
    }
    async CheckOut(userId, data, ipAddr) {
        for (const item of data.productVariants) {
            const productVariant = await prisma.productVariant.findUnique({ where: { id: item.productVariantId } });
            const product = await prisma.product.findUnique({ where: { id: productVariant.productId } });
            if (!productVariant) throw new ServerException(`Sản phẩm ${product.name} size: ${productVariant.size}, color: ${productVariant.color} không tồn tại`, 404);
            if (productVariant.stock < item.quantity) throw new ServerException(`Sản phẩm ${product.name} size: ${productVariant.size}, color: ${productVariant.color} đã hết hàng`, 400);
            if (productVariant.isActive === false) throw new ServerException(`Sản phẩm ${product.name} size: ${productVariant.size}, color: ${productVariant.color} đã ngừng bán`, 400);
        }
        let discountApplied = 0;
        let coupon = null;
        if (data.couponId) {
            coupon = await prisma.coupon.findUnique({
                where: {
                    id: data.couponId
                }
            });
            if (coupon.promotionalType === "SHIPPING" && coupon.discountType === "PERCENTAGE") discountApplied = (data.shippingCost * coupon.discountValue) / 100;
            else if (coupon.promotionalType === "SHIPPING" && coupon.discountType === "FIXED_AMOUNT") discountApplied = coupon.discountValue;
            else if (coupon.promotionalType === "PRODUCT" && coupon.discountType === "PERCENTAGE") discountApplied = (data.totalAmount * coupon.discountValue) / 100;
            else if (coupon.promotionalType === "PRODUCT" && coupon.discountType === "FIXED_AMOUNT") discountApplied = coupon.discountValue;
            await prisma.voucherWithUser.updateMany({
                where: {
                    userId,
                    couponId: data.couponId,
                    isUse: false,
                },
                data: {
                    isUse: true,
                }
            });
        }
        const paymentMethod = await prisma.paymentMethod.findUnique({
            where: {
                id: data.paymentMethodId
            }
        });
        const newOrder = await prisma.order.create({
            data: {
                userId,
                totalAmount: data.totalAmount,
                shippingCost: data.shippingCost,
                shippingAddressId: data.shippingAddressId,
                paymentMethodId: data.paymentMethodId,
                notes: data.notes,
                discountApplied,
                discountAppliedType: data.couponId ? coupon.promotionalType : null,
                couponId: data.couponId || null,
                orderDetails: {
                    create: data.productVariants.map((item) => ({
                        productVariantId: item.productVariantId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        subtotal: item.totalPrice,
                    })),
                },
            },
        });
        const transactionId = Date.now().toString().slice(-10) + Math.floor(Math.random() * 100).toString().padStart(2, "0");
        const newPayment = await prisma.payment.create({
            data: {
                amount: data.totalAmount + data.shippingCost - discountApplied,
                paymentMethodId: data.paymentMethodId,
                transactionId: transactionId,
                orderId: newOrder.id,
            },
        });

        console.log("Payment Data:", {
            amount: newPayment.amount,
            transactionId: transactionId,
            ipAddr,
        });
        // order.service.js
        if (paymentMethod.type === "VNPAY") {
            const vnpUrl = buildVnpayUrl({
                amount: newPayment.amount,
                transactionId: transactionId,
                ipAddr,
            });
            return { redirectUrl: vnpUrl };
        }
        return newOrder;
    }
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
    async cancelled(userId, orderId,note) {
        if (!await prisma.user.findUnique({ where: { id: userId } })) throw new ServerException("Người dùng không tồn tại", 404);
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (order.status === "Pending") {
            await prisma.order.update({
                where: { id: orderId },
                data: { 
                    status: "Cancelled",
                    notes: note }
            });
        }
        else throw new ServerException("Đơn hàng không thể hủy", 400);
    }
    async getProductVariantById(productVariantId) {
        const productVariant = await prisma.productVariant.findUnique({
            where: { id: productVariantId },
            include:{
                product: true,
            }
        });
        return productVariant;
    }
    async getOrderById(orderId) {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderDetails: true,
                payments: true,
            }
        });
        return order;
    }
}
