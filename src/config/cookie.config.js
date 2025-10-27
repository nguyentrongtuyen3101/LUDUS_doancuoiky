export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV || "production",
  maxAge: 3600 * 1000, // 1 giờ
  sameSite: "none",
};