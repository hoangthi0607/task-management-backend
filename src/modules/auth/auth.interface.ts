import { RefreshTokens } from "../../generated/prisma/client.js";
import { CreateRefreshTokenDto } from "./auth.dto.js";

export interface IAuthRepository {
  findByToken(token: string): Promise<RefreshTokens | null>;

  create(data: CreateRefreshTokenDto): Promise<RefreshTokens>;

  delete(token: string): Promise<number>;

  deleteByUserId(userId: number): Promise<number>;
}