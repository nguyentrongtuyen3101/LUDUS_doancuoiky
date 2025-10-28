import { ClientException } from "../../../utils/errors.js";

export class CartDto {
  constructor(data) {
    this.quantity = parseInt(data.quantity);
    this.validate();
  }
  validate() {
    if (this.quantity<1) throw new ClientException("Số lượng phải lớn hơn 0", 400);
  }
}