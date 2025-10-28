import prisma from "../../../prisma/client.js"; 
import { ServerException } from "../../../utils/errors.js";

export class WishlistService{
    async addToWishlist(userId,productVariantId) {
        const wishlist=await prisma.wishlist.findUnique({ where: { userId } });
        if(!wishlist) throw new ServerException("Danh sách yêu thích không tồn tại",404);
        const productVariant=await prisma.productVariant.findUnique({ where: { id: productVariantId } });
        if(!productVariant) throw new ServerException("Sản phẩm không tồn tại",404);
        let wishlistItem=await prisma.wishlistDetailt.findFirst({
            where:{
                wishlistId:wishlist.id,
                productVariantId
            }
        });
        if(wishlistItem) throw new ServerException("Sản phẩm đã có trong danh sách yêu thích",400);
        const newWishlistItem=await prisma.wishlistDetailt.create({
            data:{
                wishlist: { connect: { id: wishlist.id } },
                productVariant: { connect: { id: productVariantId } }
            }
        });
        return newWishlistItem;
    }
    async removeFromWishlist(userId,productVariantId) {
        const wishlist=await prisma.wishlist.findUnique({ where: { userId } });
        if(!wishlist) throw new ServerException("Danh sách yêu thích không tồn tại",404);
        const wishlistItem=await prisma.wishlistDetailt.deleteMany({
            where:{
                wishlistId:wishlist.id,
                productVariantId
            }
        });
        return wishlistItem;
    }
    async deleteAll(userId) {
        const wishlist=await prisma.wishlist.findUnique({ where: { userId } });
        if(!wishlist) throw new ServerException("Danh sách yêu thích không tồn tại",404);
        const wishlistdelete=await prisma.wishlistDetailt.deleteMany({where :{wishlistId:wishlist.id}});
        return wishlistdelete;
    }
    async getAll(userId) {
        const wishlist=await prisma.wishlist.findUnique({ where: { userId } });
        if(!wishlist) throw new ServerException("Danh sách yêu thích không tồn tại",404);
        const wishlistItems=await prisma.wishlist.findUnique({ where: { userId }, include: { wishlistDetailts: { include: { productVariant: true } } } });
        return wishlistItems;
    }
}