import { PrismaClient } from '../../prisma/generated/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const prisma = new PrismaClient();

type LoginData = {
  identifier: string;
  password: string;
};

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

  async login(data: LoginData) {
    const { identifier, password } = data;

    if (!identifier) {
      throw new Error('Email or username is required');
    }

    if (!password) {
      throw new Error('Password is required');
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });
    if (!existingUser) {
      throw new Error('Account not found');
    }

    const checkPassword = await bcrypt.compare(data.password, existingUser.password);
    if (!checkPassword) {
      throw new Error('Invalid Password');
    }

    const user = {
      id: existingUser.id,
      fullname: existingUser.fullname,
      email: existingUser.email,
      username: existingUser.username,
      phoneNumber: existingUser.phoneNumber,
      role: existingUser.role,
    };

    const jwtToken = jwt.sign(user, env.JWT_SECRET as string);

    return { user, jwtToken };
  }

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
