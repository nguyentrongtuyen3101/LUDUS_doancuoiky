import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET; 
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h"; 

export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      isActive: user.isActive 
    }, 
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
