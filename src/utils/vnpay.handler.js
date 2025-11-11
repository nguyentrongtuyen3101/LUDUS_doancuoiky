import qs from "qs";
import crypto from "crypto";
import prisma from "../prisma/client.js";
import { vnpayConfig } from "../config/vnpay.config.js";

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
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

// vnpay.handler.js
export async function handleVnpayReturn(req, res) {
  const vnp_Params = { ...req.query };
  const secureHash = vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  const sorted = sortObject(vnp_Params);
  const signData = qs.stringify(sorted, { encode: false });
  const signed = crypto
    .createHmac("sha512", vnpayConfig.vnp_HashSecret)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  console.log("Full VNPAY Response:", vnp_Params);
  console.log("Sign Data:", signData);
  console.log("Generated Signature:", signed);
  console.log("Secure Hash from VNPAY:", secureHash);

  const transactionId = vnp_Params["vnp_TxnRef"]; // ✅ Giữ nguyên string

  if (secureHash === signed) {
    if (vnp_Params["vnp_ResponseCode"] === "00") {
      // ✅ Tìm payment qua orderId
      const payment = await prisma.payment.findFirst({ 
        where: { transactionId: transactionId } 
      });
      
      if (!payment) {
        return res.status(404).send("Payment not found");
      }

      if (!payment.status) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: true },
        });
      }
    }
    return res.redirect(`${process.env.FRONTEND_URL_USER}/dashboard/dash-my-order`);
  } else {
    console.log("❌ Signature mismatch!");
    return res.status(400).send("Invalid signature");
  }
}

export async function handleVnpayIpn(req, res) {
  const vnp_Params = { ...req.query };
  const secureHash = vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  const sorted = sortObject(vnp_Params);
  const signData = qs.stringify(sorted, { encode: false });
  const signed = crypto
    .createHmac("sha512", vnpayConfig.vnp_HashSecret)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  console.log("VNPAY IPN Params:", vnp_Params);
  console.log("Generated Signature:", signed);
  console.log("Secure Hash from VNPAY:", secureHash);

  if (secureHash !== signed) {
    return res.status(200).json({ RspCode: "97", Message: "Invalid signature" });
  }

  const transactionId = vnp_Params["vnp_TxnRef"]; // ✅ String
  const rspCode = vnp_Params["vnp_ResponseCode"];

  if (rspCode === "00") {
    const payment = await prisma.payment.findFirst({ 
      where: { transactionId: transactionId } 
    });
    
    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: true },
      });
    }
    return res.status(200).json({ RspCode: "00", Message: "Success" });
  } else {
    return res.status(200).json({ RspCode: "01", Message: "Payment failed" });
  }
}
