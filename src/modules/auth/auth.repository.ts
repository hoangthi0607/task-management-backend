import { prisma } from "../../shared/prisma/prisma.service.js";
import { IAuthRepository } from "./auth.interface.js";
import { CreateRefreshTokenDto } from "./auth.dto.js";

export class AuthRepository implements IAuthRepository {
  async findByToken(token: string) {
    return prisma.refreshTokens.findFirst({
      where: { token },
    });
  }

  async create(data: CreateRefreshTokenDto) {
    return prisma.refreshTokens.create({
      data: {
        user_id: data.user_id,
        token: data.token,
        expires_at: data.expires_at,
      },
    });
  }

  async delete(token: string) {
    const result = await prisma.refreshTokens.deleteMany({
      where: { token },
    });
  
    return result.count;
  }

  async deleteByUserId(userId: number) {
    const result = await prisma.refreshTokens.deleteMany({
      where: { user_id: userId },
    });

    return result.count;
  }
}

// Singleton
export const authRepository = new AuthRepository();