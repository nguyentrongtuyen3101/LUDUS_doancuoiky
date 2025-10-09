import { ClientException } from "../../../utils/errors.js";

export class createDto {
  constructor(data) {
    this.name = data.name?.trim();
    this.description = data.description?.trim();
    this.validate();
  }
  validate() {
    if(!this.name || this.name.length < 2) throw new ClientException("Ten dạnh mục phải lớn hơn hai ký tự ", 400);
    if(this.description && this.description.length < 10) throw new ClientException("Mô tả phải lớn hơn 10 ký tự", 400);
  }
}