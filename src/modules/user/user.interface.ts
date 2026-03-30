
import { CreateUserDto, UpdateUserDto } from "./user.dto.js";
import { User } from "../../generated/prisma/client.js";

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  create(data: CreateUserDto): Promise<User>;
  update(id: number, data: UpdateUserDto): Promise<User>;
  delete(id: number): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
