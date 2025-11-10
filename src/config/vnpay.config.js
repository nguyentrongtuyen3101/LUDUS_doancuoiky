import crypto from "crypto";
import qs from "qs";

export const vnpayConfig = {
  vnp_TmnCode: process.env.VNP_TMN_CODE?.trim(),
  vnp_HashSecret: process.env.VNP_HASH_SECRET?.trim(),
  vnp_Url: process.env.VNP_URL?.trim(),
  vnp_ReturnUrl: `${process.env.PUBLIC_URL}/callback/vnpay_return`,
  vnp_IpnUrl: `${process.env.PUBLIC_URL}/callback/vnpay_ipn`,
};

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach(key => {
    sorted[key] = obj[key];
  });
  return sorted;
}

export function buildVnpayUrl({ amount, transactionId, ipAddr, bankCode }) {
  const date = new Date();
  const createDate = `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date
    .getDate()
    .toString()
    .padStart(2, "0")}${date
    .getHours()
    .toString()
    .padStart(2, "0")}${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}${date
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnpayConfig.vnp_TmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: transactionId,
    vnp_OrderInfo: "Thanh-toan-don-hang-" + transactionId,
    vnp_OrderType: "other",
    vnp_Amount: String(amount * 100), // Convert to string
    vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnp_Params.vnp_BankCode = bankCode;
  }

  // Sort params
  vnp_Params = sortObject(vnp_Params);

  console.log("==== VNPAY DEBUG ====");
  console.log("Sorted Params:", JSON.stringify(vnp_Params, null, 2));
  
  // Tạo sign data với qs.stringify - encode: false
  const signData = qs.stringify(vnp_Params, { encode: false });
  
  console.log("Sign Data:", signData);
  console.log("Hash Secret:", vnpayConfig.vnp_HashSecret);
  
  // Tạo HMAC SHA512 - Dùng Buffer.from() như code demo VNPay
  const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
  const secureHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  
  console.log("Generated Hash:", secureHash);

  // Tạo final URL - KHÔNG sort lại sau khi thêm SecureHash
  const urlParams = { ...vnp_Params };
  urlParams.vnp_SecureHash = secureHash;
  
  const finalUrl = vnpayConfig.vnp_Url + "?" + qs.stringify(urlParams, { encode: false });
  
  console.log("Final URL:", finalUrl);
  console.log("====================");
  
  return finalUrl;
}

// Hàm verify callback từ VNPay
export function verifyVnpayCallback(vnpParams) {
  const secureHash = vnpParams.vnp_SecureHash;
  
  // Xóa các params không dùng để sign
  const params = { ...vnpParams };
  delete params.vnp_SecureHash;
  delete params.vnp_SecureHashType;
  
  // Sort params
  const sortedParams = sortObject(params);
  
  // Tạo sign data
  const signData = qs.stringify(sortedParams, { encode: false });
  
  // Tạo hash để verify
  const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
  const calculatedHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  
  console.log("==== VERIFY CALLBACK ====");
  console.log("Sign Data:", signData);
  console.log("Received Hash:", secureHash);
  console.log("Calculated Hash:", calculatedHash);
  console.log("Match:", secureHash === calculatedHash);
  console.log("========================");
  
  return secureHash === calculatedHash;
}