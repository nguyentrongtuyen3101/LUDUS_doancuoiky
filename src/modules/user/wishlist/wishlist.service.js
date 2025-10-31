import prisma from "../../../prisma/client.js"; 
import { ServerException } from "../../../utils/errors.js";

export class WishlistService{
    async addToWishlist(userId,productId) {
        const wishlist=await prisma.wishlist.findUnique({ where: { userId } });
        if(!wishlist) throw new ServerException("Danh sách yêu thích không tồn tại",404);
        const product=await prisma.product.findUnique({ where: { id: productId } });
        if(!product) throw new ServerException("Sản phẩm không tồn tại",404);
        let wishlistItem=await prisma.wishlistDetailt.findFirst({
            where:{
                wishlistId:wishlist.id,
                productId
            }
        });
        if(wishlistItem)
            {
                await prisma.wishlistDetailt.delete({
                    where:{
                        id:wishlistItem.id
                    }
                });  
            }
        const newWishlistItem=await prisma.wishlistDetailt.create({
            data:{
                wishlist: { connect: { id: wishlist.id } },
                product: { connect: { id: productId } }
            }
        });
        return newWishlistItem;
    }
    async removeFromWishlist(userId,productId) {
        const wishlist=await prisma.wishlist.findUnique({ where: { userId } });
        if(!wishlist) throw new ServerException("Danh sách yêu thích không tồn tại",404);
        const wishlistItem=await prisma.wishlistDetailt.deleteMany({
            where:{
                wishlistId:wishlist.id,
                productId
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
        const wishlistItems=await prisma.wishlist.findUnique({ where: { userId }, include: { wishlistDetailts: { include: { product: true } } } });
        return wishlistItems;
    }
}