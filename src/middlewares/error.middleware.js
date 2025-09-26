// src/middlewares/error.middleware.js
import { SystemException, ClientException, ServerException } from "../utils/errors.js";

export function errorMiddleware(err, req, res, next) {
  // Nếu lỗi là instance của 3 loại mình định nghĩa
  if (err instanceof SystemException || err instanceof ClientException || err instanceof ServerException) {
    console.error(`[${err.type}]`, err.message);

    return res.status(err.status).json({
      success: false,
      type: err.type,
      message: err.message,
      timeStamp: Date.now(),
    });
  }

  // Nếu lỗi không rõ loại → fallback 500
  console.error("[UNKNOWN_ERROR]", err);

  res.status(500).json({
    success: false,
    type: "UNKNOWN_ERROR",
    message: "Internal Server Error",
    timeStamp: Date.now(),
  });
}
