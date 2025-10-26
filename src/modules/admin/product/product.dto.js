import { ClientException } from "../../../utils/errors.js";

export class createDto {
    constructor(data) {
        this.name = data.name?.trim();
        this.description = data.description?.trim();
        this.price = parseFloat(data.price);
        this.stockQuantity = parseInt(data.stockQuantity);
        this.imageUrl = data.imageUrl?.trim();
        this.productCode = data.productCode?.trim();
        this.sizes = data.sizes ? JSON.parse(data.sizes) : null;
        this.colors = data.colors ? JSON.parse(data.colors) : null;
        this.validate();
    }
    validate() {
        if (!this.name || this.name.length < 2) throw new ClientException("Tên sản phẩm phải lớn hơn hai ký tự", 400);
        if (this.description && this.description.length < 10) throw new ClientException("Mô tả phải lớn hơn 10 ký tự", 400);
        if (isNaN(this.price) || this.price <= 0) throw new ClientException("Giá sản phẩm phải là số và hơn hơn 0", 400);
        if (isNaN(this.stockQuantity) || this.stockQuantity < 0) throw new ClientException("Số lượng tồn kho phải là số và hơn hơn 0", 400);
        if (!this.productCode || this.productCode.length < 2) throw new ClientException("Mã sản phẩm phải lớn hơn hai ký tự", 400);
        if (this.sizes && !Array.isArray(this.sizes)) throw new ClientException("Kích thước không dc để chống ", 400);
        if (this.colors && !Array.isArray(this.colors)) throw new ClientException("Màu sắc không được để chống ", 400);
    }
}
export class updateDto {
    constructor(data) {
        this.name = data.name?.trim();
        this.description = data.description?.trim();
        this.price = parseFloat(data.price);
        this.stockQuantity = parseInt(data.stockQuantity);
        this.imageUrl = data.imageUrl?.trim();
        this.productCode = data.productCode?.trim();
        this.sizes = data.sizes ? JSON.parse(data.sizes) : null;
        this.colors = data.colors ? JSON.parse(data.colors) : null;
        this.validate();
    }
    validate() {
        if (!this.name || this.name.length < 2) throw new ClientException("Tên sản phẩm phải lớn hơn hai ký tự", 400);
        if (this.description && this.description.length < 10) throw new ClientException("Mô tả phải lớn hơn 10 ký tự", 400);
        if (isNaN(this.price) || this.price <= 0) throw new ClientException("Giá sản phẩm phải là số và hơn hơn 0", 400);
        if (isNaN(this.stockQuantity) || this.stockQuantity < 0) throw new ClientException("Số lượng tồn kho phải là số và hơn hơn 0", 400);
        if (!this.productCode || this.productCode.length < 2) throw new ClientException("Mã sản phẩm phải lớn hơn hai ký tự", 400);
        if (this.sizes && !Array.isArray(this.sizes)) throw new ClientException("Kích thước không dc để chống ", 400);
        if (this.colors && !Array.isArray(this.colors)) throw new ClientException("Màu sắc không được để chống ", 400);
    }
}