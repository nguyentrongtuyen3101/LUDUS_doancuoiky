import crypto from "crypto";
import querystring from "qs";

export const vnpayConfig = {
  vnp_TmnCode: process.env.VNP_TMN_CODE,
  vnp_HashSecret: process.env.VNP_HASH_SECRET,
  vnp_Url: process.env.VNP_URL,
  vnp_ReturnUrl: `${process.env.PUBLIC_URL}/callback/vnpay_return`,
  vnp_IpnUrl: `${process.env.PUBLIC_URL}/callback/vnpay_ipn`,
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  // ✅ Fix ESLint warning
  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export function buildVnpayUrl({ amount, transactionId, ipAddr}) {
  const date = new Date();
  
  const createDate = 
    date.getFullYear() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0") +
    String(date.getHours()).padStart(2, "0") +
    String(date.getMinutes()).padStart(2, "0") +
    String(date.getSeconds()).padStart(2, "0");

  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = vnpayConfig.vnp_TmnCode;
  vnp_Params["vnp_Locale"] = "vn";
  vnp_Params["vnp_CurrCode"] = "VND";
  vnp_Params["vnp_TxnRef"] = transactionId;
  vnp_Params["vnp_OrderInfo"] = "Thanh toan don hang " + transactionId;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] =(amount * 100).toString();
  vnp_Params["vnp_ReturnUrl"] = vnpayConfig.vnp_ReturnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;

  vnp_Params = sortObject(vnp_Params);

  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  
  let vnpUrl = vnpayConfig.vnp_Url + "?" + querystring.stringify(vnp_Params, { encode: false });

  console.log("==== VNPAY DEBUG ====");
  console.log("Sign Data:", signData);
  console.log("Generated Hash:", signed);
  console.log("Final URL:", vnpUrl);
  console.log("====================");

  return vnpUrl;
}