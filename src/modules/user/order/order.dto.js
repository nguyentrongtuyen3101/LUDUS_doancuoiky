import { ClientException } from "../../../utils/errors.js";

export class OrderDTO {
  constructor(data) {
    this.shippingAddressId = data.shippingAddressId;
    this.paymentMethodId = data.paymentMethodId;
    this.couponId = data.couponId || null;
    this.totalAmount = Number(data.totalAmount);
    this.shippingCost = Number(data.shippingCost);
    this.notes = data.notes || null;
    this.productVariants = Array.isArray(data.productVariants)
      ? data.productVariants.map(p => new ProductVariantDTO(p))
      : [];
  }
}
class ProductVariantDTO {
  constructor(data) {
    this.productVariantId = data.productVariantId;
    this.quantity = Number(data.quantity);
    this.unitPrice = Number(data.unitPrice);
    this.totalPrice = Number(data.totalPrice);
  }
}