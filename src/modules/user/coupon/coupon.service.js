import prisma from "../../../prisma/client.js";
import { ServerException } from "../../../utils/errors.js";

export class couponService {
    async getAll(userId) {
        const usedCouponIds = await prisma.voucherWithUser.findMany({
            where: { userId },
            select: { couponId: true }
        });

        const vouchers = await prisma.coupon.findMany({
            where: {
                isActive: true,
                endDate: { gte: new Date() },
                maxUsage: { gt: 0 },
                id: {
                    notIn: usedCouponIds.map(v => v.couponId)
                }
            },
            orderBy: { startDate: "desc" },
        });

        return vouchers;
    }
    async getCouponByCode(userId, couponId) {
        const usedCoupon = await prisma.voucherWithUser.create({
            data: {
                user: { connect: { id: userId } },
                coupon: { connect: { id: couponId } },
                isUse: false
            }
        });
        await prisma.coupon.update({
            where: { id: couponId },
            data: {
                maxUsage: {
                    decrement: 1
                }
            }
        });
        return usedCoupon;
    }
}