import jwt from "jsonwebtoken";
import authConfig from "../config/auth.js";

export function generateVerificationToken(userId) {
  return jwt.sign({ userId }, authConfig.secret, { expiresIn: authConfig.expiry });
}

export function verifyVerificationToken(token) {
  return jwt.verify(token, authConfig.secret);
}