import { IRoleRepository } from "./role.interface.js";
import { CreateRoleDto,UpdateRoleDto } from "./role.dto.js";
import { prisma } from "../../shared/prisma/prisma.service.js";

export class RoleRepository implements IRoleRepository {
    async findAll() {
        return prisma.role.findMany({
            include: {
                User: true
            }
        });
    }

    async findById(id: number) {
        return prisma.role.findUnique({
            where: { role_id: id },
            include: {
                User: true
            }
        });
    }

    async create(data: CreateRoleDto) {
        return prisma.role.create({
            data,
            include: {
                User: true
            }
        });
    }

    async update(id: number, data: Partial<UpdateRoleDto>) {
        return prisma.role.update({
            where: { role_id: id },
            data,
            include: {
                User: true
            }
        });
    }

    async delete(id: number) {
        return prisma.role.delete({
            where: { role_id: id },
            include: {
                User: true
            }
        });
    }

    async findByName(name: string) {
        return prisma.role.findUnique({
            where: { role_name: name },
            include: {
                User: true
            }
        });
    }
}

// Singleton
export const roleRepository = new RoleRepository();