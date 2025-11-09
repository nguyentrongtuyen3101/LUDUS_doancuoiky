import qs from "qs";
import crypto from "crypto";

export const vnpayConfig = {
  vnp_TmnCode: process.env.VNP_TMN_CODE,
  vnp_HashSecret: process.env.VNP_HASH_SECRET,
  vnp_Url: process.env.VNP_URL,
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
    vnp_TxnRef: transactionId.toString(),
    vnp_OrderInfo: "Thanh toan don hang " + transactionId,
    vnp_OrderType: "other",
    vnp_Amount: (amount * 100).toString(),
    vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  // ✅ Sort theo alphabet
  vnp_Params = sortObject(vnp_Params);

  // ✅ Tạo query string để tính hash - fix ESLint warning
  const signData = Object.keys(vnp_Params).map(key => {
    return key + "=" + vnp_Params[key];
  });
  const signDataString = signData.join("&");
  
  console.log("==== VNPAY DEBUG ====");
  console.log("Sign Data:", signDataString);
  console.log("Hash Secret:", vnpayConfig.vnp_HashSecret);
  console.log("Hash Secret Length:", vnpayConfig.vnp_HashSecret?.length);
  console.log("TMN Code:", vnpayConfig.vnp_TmnCode);
  
  // ✅ Tạo HMAC SHA512
  const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signDataString, "utf-8")).digest("hex");
  
  console.log("Generated Hash:", signed);

  // ✅ Thêm secure hash
  vnp_Params["vnp_SecureHash"] = signed;

  // ✅ Tạo URL với encoding
  const urlParams = new URLSearchParams();
  Object.keys(vnp_Params).forEach(key => {
    urlParams.append(key, vnp_Params[key]);
  });

  const finalUrl = `${vnpayConfig.vnp_Url}?${urlParams.toString()}`;
  console.log("Final URL:", finalUrl);
  console.log("====================");
  
  return finalUrl;
}