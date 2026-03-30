export interface CreateRefreshTokenDto {
  user_id: number;
  token: string;
  expires_at: Date;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  name: string;
  password: string;
  role_id: number;
  department_id?: number;
}

export interface RefreshTokenDto {
  refreshToken: string;
}