
import bcrypt from "bcryptjs";
import prisma from "../../prisma/client.js"; 
import { ServerException } from "../../utils/errors.js";
import { generateVerificationToken } from "../../utils/token.js";
import { sendVerificationEmail } from "../../utils/sendmail.js";
class AuthService {
  async register(data) {
    
    const existingUser = await prisma.user.findUnique({
      where: 
      { 
        email: data.email 
        }
    });
    if (existingUser) throw new ServerException("Email already registered", 409);
    
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        birthday: new Date(data.birthday),
        gender: data.gender,
        email: data.email,
        password: hashedPassword,
        role: "User",
      }
    });
    const token = generateVerificationToken(newUser.id);
    await sendVerificationEmail(newUser, token);

    return newUser;
  }
}

export default new AuthService();
