import { IUserRepository } from "./user.interface.js";
import { prisma } from "../../shared/prisma/prisma.service.js";
import { CreateUserDto, UpdateUserDto } from "./user.dto.js";

export class UserRepository implements IUserRepository {
  async findAll() {
    return prisma.user.findMany();
  }

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { user_id: id },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserDto) {
    console.log("[UserRepository.create] Creating user with email:", data.email);
    try {
      const result = await prisma.user.create({
        data,
      });
      console.log("[UserRepository.create] User created:", result.user_id);
      return result;
    } catch (error: any) {
      console.error("[UserRepository.create] Error:", error.message, error);
      throw error;
    }
  }

  async update(id: number, data: UpdateUserDto) {
    return prisma.user.update({
      where: { user_id: id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.user.delete({
      where: { user_id: id },
    });
  }
}

// Singleton
export const userRepository = new UserRepository();