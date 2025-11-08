import prisma from "../../../prisma/client.js";
import { ServerException } from "../../../utils/errors.js";

export class voucherService {
    async crate(data) {
        let found = false;
        let codeValue;

        while (!found) {
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            const existingVoucher = await prisma.coupon.findUnique({ where: { code } });
            if (!existingVoucher) {
                codeValue = code;
                found = true;
            }
        }
        const newVoucher = await prisma.coupon.create({
            data: {
                code: codeValue,
                promotionalType: data.promotionalType,
                discountType: data.discountType,
                discountValue: data.discountValue,
                startDate: data.startDate,
                endDate: data.endDate,
                maxUsage: data.maxUsage,
            }
        });
        return newVoucher;
    }
    async delete(id) {
        const voucher = await prisma.coupon.findUnique({ where: { id } });
        if (!voucher) throw new ServerException("Voucher không tồn tại", 404);
        await prisma.coupon.update({ where: { id }, data: { isActive: false } });
        if(await prisma.voucherWithUser.count({where:{couponId:id,isUse:false}})>0)
        await prisma.voucherWithUser.updateMany({ where: { couponId: id }, data: { isUse: true } });
        return { message: "Xóa voucher thành công" };
    }
    async getAll(query) {
        const where = { isActive: true,endDate: {gte: new Date()} };
        const vouchers = await prisma.coupon.findMany({
            where,
            skip: query.offset,
            take: query.limit,
            orderBy: { startDate: "desc" },
        });
        const total = await prisma.coupon.count(
            { where }
        );
        const totalPages = Math.ceil(total / query.limit);
        return {
            data: vouchers,
            pagination: {
                total,
                totalPages,
                limit: query.limit,
                offset: query.offset,
            },
        };
    }
}