import prisma from "../../../prisma/client.js"; 
import { ServerException } from "../../../utils/errors.js";

export class CartService {
    async create(userId,data,productVariantId) {
        const cart=await prisma.cart.findUnique({ where: { userId } });
        if(!cart) throw new ServerException("Giỏ hàng không tồn tại",404);
        const productVariant=await prisma.productVariant.findUnique({ where: { id: productVariantId } });
        if(!productVariant) throw new ServerException("Sản phẩm không tồn tại",404);
        if(data.quantity>productVariant.stockQuantity) throw new ServerException("Số lượng trong kho không đủ",400);
        let cartDetailt=await prisma.cartDetail.findFirst({
            where:{
                cartId:cart.id,
                productVariantId
            }
        });
        if(cartDetailt) throw new ServerException("Sản phẩm đã có trong giỏ hàng, vui lòng cập nhật số lượng",400);
        const newCartDetailt=await prisma.cartDetail.create({
            data:{
                cart: { connect: { id: cart.id } },
                productVariant: { connect: { id: productVariantId } },
                quantity:data.quantity,
                unitPrice:productVariant.variantPrice
            }
        });
        return newCartDetailt;
    }
    async update(userId,data,productVariantId) {
        const cart=await prisma.cart.findUnique({ where: { userId } });
        if(!cart) throw new ServerException("Giỏ hàng không tồn tại",404);
        const productVariant=await prisma.productVariant.findUnique({ where: { id: productVariantId } });
        if(!productVariant) throw new ServerException("Sản phẩm không tồn tại",404);
        if(data.quantity>productVariant.stockQuantity) throw new ServerException("Số lượng trong kho không đủ",400);
        const cartDetailt=await prisma.cartDetail.updateMany({
            where:{
                cartId:cart.id,
                productVariantId
            },
            data:{
                quantity:data.quantity
            }
        });
        return cartDetailt;
    }
    async deleteById(userId,productVariantId) {
        const cart=await prisma.cart.findUnique({ where: { userId } });
        if(!cart) throw new ServerException("Giỏ hàng không tồn tại",404);
        const cartDetailt=await prisma.cartDetail.deleteMany({
            where:{
                cartId:cart.id,
                productVariantId
            }
        });
        return cartDetailt;
    }
    async deleteAll(userId) {
        const cart=await prisma.cart.findUnique({ where: { userId } });
        if(!cart) throw new ServerException("Giỏ hàng không tồn tại",404);
        const cartDetailt=await prisma.cartDetail.deleteMany({
            where:{
                cartId:cart.id,
            }
        });
        return cartDetailt;
    }
    async getAll(userId) {
        const cart=await prisma.cart.findUnique({ where: { userId }, include: { cartDetails: { include: { productVariant: true } } } });
        if(!cart) throw new ServerException("Giỏ hàng không tồn tại",404);
        return cart;
    }
}
