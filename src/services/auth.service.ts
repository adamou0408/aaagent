import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, UserRole } from "../entities/user.entity";
import { UserRepository } from "../repositories/user.repository";
import { env } from "../config/env";
import { logger } from "../config/logger";
import { AppError } from "../utils/errors";

export interface RegisterDto {
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export class AuthService {
  private userRepo: UserRepository;

  constructor(userRepo?: UserRepository) {
    this.userRepo = userRepo ?? new UserRepository();
  }

  async register(dto: RegisterDto): Promise<Omit<User, "passwordHash">> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new AppError("Email already registered", 409);
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.userRepo.create({
      email: dto.email,
      passwordHash,
    });

    logger.info("User registered", { userId: user.id, email: user.email });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword as Omit<User, "passwordHash">;
  }

  async login(dto: LoginDto): Promise<{ token: string }> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new AppError("Invalid credentials", 401);
    }

    const payload: AuthPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRATION as string & jwt.SignOptions["expiresIn"],
    });

    logger.info("User logged in", { userId: user.id });
    return { token };
  }

  verifyToken(token: string): AuthPayload {
    return jwt.verify(token, env.JWT_SECRET) as AuthPayload;
  }
}
