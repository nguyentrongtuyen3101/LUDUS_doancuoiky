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
    if (!this.firstName || this.firstName.length < 2) throw new ClientException("Tên phải có ít nhất 2 ký tự", 400);
    if (!this.lastName || this.lastName.length < 2) throw new ClientException("Họ phải có ít nhất 2 ký tự", 400);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) throw new ClientException("Email không đúng định dạng", 400);

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(this.password)) throw new ClientException("Mật khẩu tối thiểu 8 ký tự phải có chữ hoa, thường, số và ký tự đặc biệt ",400);
    if(!this.birthday) throw new ClientException("Vui lòng nhập ngày tháng năm sinh", 400);
    if(!this.gender) throw new ClientException("Vui lòng chọn giới tính", 400);
    if(new Date().getFullYear()-new Date(this.birthday).getFullYear()<18) throw new ClientException("Người dùng phải đủ 18 tuổi", 400);
  }
}
export class LoginDto {
  constructor(data) {
    this.email = data.email?.toLowerCase();
    this.password = data.password;

    this.validate();
  }

  validate() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) throw new ClientException("Email không đúng định dạng", 400);
    if (!this.password) throw new ClientException("Vui lòng nhập mật khẩu", 400);
  }
}

export class SendResetPasswordDto {
  constructor(data) {
    this.email = data.email?.toLowerCase();
    this.validate();
  }

  validate() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) throw new ClientException("Email không đúng định dạng", 400);
  }
}

export class ResetPasswordDto {
  constructor(data) {
    this.password = data.password;
    this.validate();
  }

  validate() {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(this.password)) throw new ClientException("Mật khẩu tối thiểu 8 ký tự phải có chữ hoa, thường, số và ký tự đặc biệt ",400);
  }
}
