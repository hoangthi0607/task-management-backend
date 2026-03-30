export interface CreateRoleDto {
    role_name: string;
}

export interface UpdateRoleDto extends Partial<CreateRoleDto> {}