import { ClientException } from "../../../utils/errors.js";

export class CreateCouponDto {
  constructor(data) {
    this.discountValue = Number(data.discountValue);
    this.promotionalType = data.promotionalType?.toUpperCase();
    this.discountType = data.discountType?.toUpperCase();
    this.startDate = new Date(data.startDate);
    this.endDate = new Date(data.endDate);
    this.maxUsage = Number(data.maxUsage);
    this.validate();
  }

  validate() {
    const now = new Date();

    if (isNaN(this.discountValue) || this.discountValue <= 0) {
      throw new ClientException("Giá trị giảm giá phải là số và lớn hơn 0", 400);
    }

    if (!this.promotionalType) {
      throw new ClientException("Loại khuyến mãi không được để trống", 400);
    }

    if (!this.discountType) {
      throw new ClientException("Loại giảm giá không được để trống", 400);
    }

    if (isNaN(this.maxUsage) || this.maxUsage <= 0) {
      throw new ClientException("Số lượng sử dụng tối đa phải là số dương", 400);
    }

    if (!(this.startDate instanceof Date) || isNaN(this.startDate)) {
      throw new ClientException("Ngày bắt đầu không hợp lệ", 400);
    }
    if (!(this.endDate instanceof Date) || isNaN(this.endDate)) {
      throw new ClientException("Ngày kết thúc không hợp lệ", 400);
    }

    // ✅ Ngày bắt đầu phải sau ngày hiện tại
    if (this.startDate < now) {
      throw new ClientException("Ngày bắt đầu phải lớn hơn ngày hiện tại", 400);
    }

    // ✅ Ngày kết thúc phải sau ngày hiện tại
    if (this.endDate < now) {
      throw new ClientException("Ngày kết thúc phải lớn hơn ngày hiện tại", 400);
    }

    // ✅ Ngày bắt đầu < ngày kết thúc
    if (this.startDate >= this.endDate) {
      throw new ClientException("Ngày bắt đầu phải nhỏ hơn ngày kết thúc", 400);
    }
  }
}
