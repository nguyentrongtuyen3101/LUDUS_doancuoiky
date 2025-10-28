
export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 3600 * 1000, // 1 giờ
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

// Cookie dành riêng cho quá trình reset password
export const resetPasswordCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 15 * 60 * 1000, // 10 phút
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};
