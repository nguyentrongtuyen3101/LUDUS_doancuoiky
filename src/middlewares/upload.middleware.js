// upload.middleware.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { ClientException } from "../utils/errors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đường dẫn tuyệt đối tới thư mục uploads ở root
const UPLOAD_DIR = path.resolve(__dirname, "../../uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR); // lưu vào ./uploads
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|webp/;
  const ext = path.extname(file.originalname).slice(1).toLowerCase();

  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new ClientException("Định dạng hình ảnh không hợp lệ", 400), false);
  }
};

export const upload = multer({ storage, fileFilter });
export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: { files: 10 },
}).array("files", 10);