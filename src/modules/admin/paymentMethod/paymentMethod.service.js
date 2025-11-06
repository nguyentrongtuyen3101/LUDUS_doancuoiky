import prisma from "../../../prisma/client.js"; 
import { ServerException ,ClientException} from "../../../utils/errors.js";

export class PaymentMethodService{
    async getAllPaymentMethodsWhereIsActive(){
        const paymentMethods = await prisma.paymentMethod.findMany({
            where: { isActive: true }
        });
        return paymentMethods;
    }
    async setIsActive(paymentMethodId){
        const paymentMethod = await prisma.paymentMethod.findUnique({
            where: { id: paymentMethodId }
        });
        if(paymentMethod.isActive===true){
            paymentMethod.isActive=false;
        }else{
            paymentMethod.isActive=true;
        }
        const updatedPaymentMethod = await prisma.paymentMethod.update({
            where: { id: paymentMethodId },
            data: { isActive: paymentMethod.isActive }
        });
        return updatedPaymentMethod;    
    }

    async getAll(){
        const paymentMethods = await prisma.paymentMethod.findMany();
        return paymentMethods;
    }
}