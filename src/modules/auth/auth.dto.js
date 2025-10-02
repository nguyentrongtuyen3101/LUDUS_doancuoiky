import { ClientException } from "../../utils/errors.js";

export class RegisterDto {
  constructor(data) {
    this.firstName = data.firstName?.trim();
    this.lastName = data.lastName?.trim();
    this.email = data.email?.toLowerCase();
    this.password = data.password;
    this.birthday = data.birthday;
    this.gender = data.gender;

    this.validate();
  }

  validate() {
    if (!this.firstName || this.firstName.length < 2) throw new ClientException("First name must be at least 2 characters", 400);
    if (!this.lastName || this.lastName.length < 2) throw new ClientException("Last name must be at least 2 characters", 400);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) throw new ClientException("Invalid email format", 400);

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(this.password)) throw new ClientException("Password must contain at least 8 characters, including uppercase, lowercase, number, and special character",400);
    if(!this.birthday) throw new ClientException("Vui lòng nhập ngày tháng năm sinh", 400);
    if(!this.gender) throw new ClientException("Vui lòng chọn giới tính", 400);
    if(new Date().getFullYear()-new Date(this.birthday).getFullYear<18) throw new ClientException("Người dùng phải đủ 18 tuổi", 400);
  }
}
