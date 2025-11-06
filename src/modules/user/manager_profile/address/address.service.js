import prisma from "../../../../prisma/client.js"; 
import { ServerException ,ClientException} from "../../../../utils/errors.js";

export class AddressService{
    async createAddress(userId, addressData){
        const user = await prisma.user.findUnique({where: { id: userId }, });
        if(!user) throw new ClientException("Người dùng không tồn tại",404);
        if(addressData.isDefault==true){
            await prisma.address.updateMany({
                where: { userId: userId, isDefault: true },
                data: { isDefault: false }
            });
        }
        if(await prisma.address.findFirst({where: { userId: userId, location: addressData.location }})) throw new ClientException("Địa chỉ đã tồn tại",400);
        const address = await prisma.address.create({
            data: {
                userId: userId,
                firstName: addressData.firstName,
                lastName: addressData.lastName,
                phoneNumber: addressData.phoneNumber,
                location: addressData.location,
                isDefault: addressData.isDefault
            }
        });
        return address;
    }
    async getAddresses(userId){
        const addresses = await prisma.address.findMany({
            where: { userId: userId }
        });
        return addresses;
    }   
    async getById(userId, addressId){
        const address = await prisma.address.findFirst({
            where: { id: addressId, userId: userId }
        });
        if(!address) throw new ClientException("Địa chỉ không tồn tại",404);
        return address;
    }
    async deleteAddress(userId, addressId){
        const address = await prisma.address.findFirst({
            where: { id: addressId, userId: userId }
        });
        if(!address) throw new ClientException("Địa chỉ không tồn tại",404);
        await prisma.address.delete({
            where: { id: addressId }
        });
        return;
    }
    async update(userId, addressId, addressData){
        const address = await prisma.address.findFirst({
            where: { id: addressId, userId: userId }
        });
        if(!address) throw new ClientException("Địa chỉ không tồn tại",404);
        if(addressData.isDefault==true){
            await prisma.address.updateMany({
                where: { userId: userId, isDefault: true },
                data: { isDefault: false }
            });
        }
        if(await prisma.address.findFirst({where: { userId: userId, location: addressData.location, id: { not: addressId } }})) throw new ClientException("Địa chỉ đã tồn tại",400);
        const updatedAddress = await prisma.address.update({
            where: { id: addressId },
            data: {
                firstName: addressData.firstName,
                lastName: addressData.lastName,
                phoneNumber: addressData.phoneNumber,
                location: addressData.location,
                isDefault: addressData.isDefault
            }
        });
        return updatedAddress;
    }
    async setDefaultAddress(userId, addressId){
        const address = await prisma.address.findFirst({
            where: { id: addressId, userId: userId }
        });
        if(!address) throw new ClientException("Địa chỉ không tồn tại",404);
        await prisma.address.updateMany({
            where: { userId: userId, isDefault: true },
            data: { isDefault: false }
        });
        const updatedAddress = await prisma.address.update({
            where: { id: addressId },
            data: { isDefault: true }
        });
        return updatedAddress;
    }
}