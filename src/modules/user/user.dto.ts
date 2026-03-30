export interface CreateUserDto {
    email: string;
    name: string;
    password: string;
    role_id: number;
    department_id?:number;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}