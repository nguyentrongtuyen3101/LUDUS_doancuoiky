import { ClientException } from "../../../../utils/errors.js";

export class UpdateDto {
  constructor(data) {
    this.firstName = data.firstName?.trim();
    this.lastName = data.lastName?.trim();
    this.email = data.email?.toLowerCase();
    this.phoneNumber = data.phoneNumber?.trim();
    this.birthday = data.birthday;
    this.gender = data.gender;

    this.validate();
  }

  validate() {
    if (!this.firstName || this.firstName.length < 2) throw new ClientException("Tên phải có ít nhất 2 ký tự", 400);
    if (!this.lastName || this.lastName.length < 2) throw new ClientException("Họ phải có ít nhất 2 ký tự", 400);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) throw new ClientException("Email không đúng định dạng", 400);
    if(!this.birthday) throw new ClientException("Vui lòng nhập ngày tháng năm sinh", 400);
    if(!this.gender) throw new ClientException("Vui lòng chọn giới tính", 400);
    if(new Date().getFullYear()-new Date(this.birthday).getFullYear()<18) throw new ClientException("Người dùng phải đủ 18 tuổi", 400);
    const phoneRegex = /^(0|\+84)(\d{9})$/;
    if (!phoneRegex.test(this.phoneNumber))
      throw new ClientException("Số điện thoại không hợp lệ", 400);
  }
}