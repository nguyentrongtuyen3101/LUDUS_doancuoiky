import jwt from "jsonwebtoken";
import {verifyConfig, resetConfig} from "../config/auth.js";

export function generateVerificationToken(userId) {
  return jwt.sign({ userId }, verifyConfig.secret, { expiresIn: verifyConfig.expiry });
}

export function verifyVerificationToken(token) {
  return jwt.verify(token, verifyConfig.secret);
}

export function generateResetcationToken(userId) {
  return jwt.sign({ userId }, resetConfig.secret, { expiresIn: resetConfig.expiry });
}

export function verifyResetcationToken(token) {
  return jwt.verify(token, resetConfig.secret);
}