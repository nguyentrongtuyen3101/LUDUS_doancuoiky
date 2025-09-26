export default {
  secret: process.env.VERIFY_TOKEN_SECRET || process.env.JWT_SECRET,
  expiry: process.env.VERIFY_TOKEN_EXPIRES_IN || "30d"
};
