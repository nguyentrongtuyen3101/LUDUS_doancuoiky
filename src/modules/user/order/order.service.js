import prisma from "../../../prisma/client.js";
import { ServerException } from "../../../utils/errors.js";

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
    async CheckOut(userId, data) {
        for(const item of data.productVariants){
            const productVariant = await prisma.productVariant.findUnique({where: {id: item.productVariantId}});
            const product=await prisma.product.findUnique({where:{id:productVariant.productId}});
            if(!productVariant) throw new ServerException(`Sản phẩm ${product.name} size: ${productVariant.size}, color: ${productVariant.color} không tồn tại`,404);
            if(productVariant.stock < item.quantity) throw new ServerException(`Sản phẩm ${product.name} size: ${productVariant.size}, color: ${productVariant.color} đã hết hàng`,400);
            if(productVariant.isActive === false) throw new ServerException(`Sản phẩm ${product.name} size: ${productVariant.size}, color: ${productVariant.color} đã ngừng bán`,400);
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
        if (paymentMethod.type === "COD") {
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
            const newPayment = await prisma.payment.create({
                data: {
                    amount: data.totalAmount + data.shippingCost - discountApplied,
                    paymentMethodId: data.paymentMethodId,
                    transactionId: Math.random().toString(36).substring(2, 8).toUpperCase(),
                    orderId: newOrder.id,
                }
            });
            return { newOrder, newPayment };
        }
    }
}
