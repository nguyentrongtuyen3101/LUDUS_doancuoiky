
import bcrypt from "bcryptjs";
import prisma from "../../prisma/client.js"; 
import { ServerException } from "../../utils/errors.js";
import { generateVerificationToken } from "../../utils/token.js";
import { sendVerificationEmail } from "../../utils/sendmail.js";
import { generateToken } from "../../utils/jwt.util.js";
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
  async loginWithGoogle(profile) {
    const email = profile.emails?.[0]?.value;
    if (!email) throw new ServerException("Google account has no email", 400);

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          firstName: profile.name?.givenName || "",
          lastName: profile.name?.familyName || "",
          email,
          password: null, 
          role: "User",
          provider: "google",
          externalId: profile.id,
          isActive: true,
        },
      });
    }

     const token = generateToken(user);

    return { user, token };
  }

  async loginWithFacebook(profile) {
    const email = profile.emails?.[0]?.value;
    if (!email) throw new ServerException("Facebook account has no email", 400);

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const fullName = profile.displayName || profile._json?.name || "";
      let firstName = "";
      let lastName = "";

      if (fullName) {
        const parts = fullName.trim().split(" ");
        firstName = parts[0] || "";
        lastName = parts.slice(1).join(" ") || "";
      }

      user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: null,
          role: "User",
          provider: "facebook",
          externalId: profile.id,
          isActive: true,
        },
      });
    }

    const token = generateToken(user);
    return { user, token };
  }

}

export default new AuthService();
