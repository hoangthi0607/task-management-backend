import { roleRepository } from "./role.repository.js";
import { CreateRoleDto, UpdateRoleDto } from "./role.dto.js";
import { IRoleRepository } from "./role.interface.js";
import { Role } from "../../generated/prisma/client.js";

export class RoleService {
    private roleRepository: IRoleRepository;

    constructor(roleRepository: IRoleRepository) {
        this.roleRepository = roleRepository;
    }

    async getAllRoles(): Promise<Role[]> {
        return this.roleRepository.findAll();
    }

    async getRoleById(id: number): Promise<Role | null> {
        return this.roleRepository.findById(id);
    }

    async getRoleByName(name: string): Promise<Role | null> {
        return (roleRepository as any).findByName(name);
    }

    async createRole(data: CreateRoleDto): Promise<Role> {
        // Check if role name already exists
        const existingRole = await this.getRoleByName(data.role_name);
        if (existingRole) {
            throw new Error(`Role with name "${data.role_name}" already exists`);
        }

        return this.roleRepository.create(data);
    }

    async updateRole(id: number, data: Partial<UpdateRoleDto>): Promise<Role | null> {
        const existingRole = await this.roleRepository.findById(id);
        if (!existingRole) {
            throw new Error(`Role with ID ${id} not found`);
        }

        // Check if new role name conflicts with existing roles
        if (data.role_name) {
            const roleWithSameName = await this.getRoleByName(data.role_name);
            if (roleWithSameName && roleWithSameName.role_id !== id) {
                throw new Error(`Role with name "${data.role_name}" already exists`);
            }
        }

        return this.roleRepository.update(id, data);
    }

    async deleteRole(id: number): Promise<Role | null> {
        const existingRole = await this.roleRepository.findById(id);
        if (!existingRole) {
            throw new Error(`Role with ID ${id} not found`);
        }

        // Check if role is being used by users
    if ((existingRole as any).User && (existingRole as any).User.length > 0) {
      throw new Error(`Cannot delete role that is assigned to ${(existingRole as any).User.length} user(s)`);
    }
        return this.roleRepository.delete(id);
    }

    // Legacy methods for backward compatibility
    async findAll() {
        return this.getAllRoles();
    }

    async findById(id: number) {
        return this.getRoleById(id);
    }

    async create(data: CreateRoleDto) {
        return this.createRole(data);
    }

    async update(id: number, data: Partial<UpdateRoleDto>) {
        return this.updateRole(id, data);
    }

    async delete(id: number) {
        return this.deleteRole(id);
    }
}

// Singleton
export const roleService = new RoleService(roleRepository);