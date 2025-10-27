import { ClientException } from "../../../utils/errors.js";

export class createDto {
    constructor(data) {
        this.size = data.size?.trim();
        this.color = data.color?.trim();
        this.variantPrice = parseFloat(data.variantPrice);
        this.stockQuantity = parseInt(data.stockQuantity);
        this.variantImageUrl = data.variantImageUrl?.trim();
        this.validate();
    }
    validate() {
        if (!this.size || this.size.length < 1) throw new ClientException("Kích thước không được để trống", 400);

        if (!this.color || this.color.length < 1) throw new ClientException("Màu sắc không được để trống", 400);

        if (isNaN(this.variantPrice) || this.variantPrice <= 0) throw new ClientException("Giá biến thể phải là số và lớn hơn 0", 400);

        if (isNaN(this.stockQuantity) || this.stockQuantity < 0) throw new ClientException("Số lượng tồn kho phải là số và không âm", 400);

    }
}