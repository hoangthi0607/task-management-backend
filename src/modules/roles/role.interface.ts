import { CreateRoleDto,UpdateRoleDto } from "./role.dto.js";
import { Role } from "../../generated/prisma/client.js";

export interface IRoleRepository {
    findAll(): Promise<Role[]>;

    findById(id: number): Promise<Role | null>;

    create(data: CreateRoleDto): Promise<Role>;

    update(id: number, data: Partial<UpdateRoleDto>): Promise<Role | null>;

    delete(id: number): Promise<Role | null>;
}