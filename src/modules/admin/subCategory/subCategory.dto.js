import { ClientException } from "../../../utils/errors.js";

export class createDto {
  constructor(data) {
    this.name = data.name?.trim();
    this.description = data.description?.trim();
    this.validate();
  }
  validate() {
    if(!this.name || this.name.length < 2) throw new ClientException("Ten dạnh mục con phải lớn hơn hai ký tự ", 400);
    if(this.description && this.description.length < 10) throw new ClientException("Mô tả phải lớn hơn 10 ký tự", 400);
  }
}
export class searchByKeyWordDto {
  constructor(data) {
    this.keyword = data.keyword?.trim();
    this.validate();
  }
  validate() {
    if(!this.keyword || this.keyword.length < 1) throw new ClientException("Từ khóa tìm kiếm không được để trống", 400);
  }
}