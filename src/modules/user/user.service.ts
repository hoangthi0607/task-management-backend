import { userRepository } from "./user.repository.js";
import bcrypt from "bcrypt";
import { CreateUserDto, UpdateUserDto } from "./user.dto.js";
import { IUserRepository } from "./user.interface.js";

export class UserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async findAll() {
        return this.userRepository.findAll();
    }

    async findById(id: number) {
        return this.userRepository.findById(id);
    }

    async findByEmail(email: string) {
        return this.userRepository.findByEmail(email);
    }

    async create(data: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.userRepository.create({
            ...data, 
            password: hashedPassword
        });
    }

    async update(id: number, data: UpdateUserDto) {
      const newData = { ...data };

      if (typeof newData.password === "string") {
        newData.password = await bcrypt.hash(newData.password, 10);
      }

      return this.userRepository.update(id, newData);
    }

    async delete(id: number) {
        return this.userRepository.delete(id);
    }

    async getAll() {
        return this.userRepository.findAll();
    }
}

// Singleton
export const userService = new UserService(userRepository);