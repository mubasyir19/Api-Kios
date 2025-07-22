import { PrismaClient } from '../../prisma/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface RegisterData {
  fullname: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: 'CLIENT' | 'SELLER';
}

class AuthService {
  async findByEmail(email: string) {
    return prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  async login() {}

  async register(data: RegisterData) {
    const checkUser = await this.findByEmail(data.email);
    if (checkUser) {
      throw new Error('An account already exist');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUser = await prisma.user.create({
      data: {
        fullname: data.fullname,
        username: data.username,
        email: data.email,
        password: hashedPassword,
        phoneNumber: data.phoneNumber,
        role: data.role,
      },
    });

    return { newUser };
  }

  async refreshToken() {}
}

export const authService = new AuthService();
