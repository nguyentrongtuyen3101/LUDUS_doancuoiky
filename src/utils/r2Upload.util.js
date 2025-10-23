import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "../config/r2.config.js";

export const uploadToR2 = async (file) => {
  const bucketName = process.env.R2_BUCKET_NAME;
  const fileName = `${Date.now()}-${file.originalname}`;

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await r2.send(new PutObjectCommand(params));

  // Trả về URL public để client dùng hiển thị ảnh
  return `https://${bucketName}.${process.env.R2_PUBLIC_DOMAIN}/${fileName}`;
};
