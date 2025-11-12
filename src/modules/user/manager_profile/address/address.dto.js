import { ClientException } from "../../../../utils/errors.js";

export class CreateDto {
  constructor(data) {
    this.firstName = data.firstName?.trim();
    this.lastName = data.lastName?.trim();
    this.phoneNumber = data.phoneNumber?.trim();
    this.location = data.location?.trim();
    this.isDefault =
      typeof data.isDefault === "string"
        ? data.isDefault === "true"
        : Boolean(data.isDefault);

    this.validate();
  }

  validate() {
    if (!this.firstName || this.firstName.length < 2) throw new ClientException("Tên phải có ít nhất 2 ký tự", 400);
    if (!this.lastName || this.lastName.length < 2) throw new ClientException("Họ phải có ít nhất 2 ký tự", 400);
    const phoneRegex = /^(0|\+84)(\d{9})$/;
    if (!phoneRegex.test(this.phoneNumber))throw new ClientException("Số điện thoại không đúng định dạng", 400);
    if (!this.location || this.location.length < 5) throw new ClientException("Địa điểm là bắt buộc", 400);
  }
}