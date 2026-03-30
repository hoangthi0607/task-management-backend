import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { userRepository } from "../user/user.repository.js";
import { authRepository } from "./auth.repository.js";

import { LoginDto, RegisterDto, RefreshTokenDto } from "./auth.dto.js";

export class AuthService {

  private excludePassword(user: any) {
    const { password, ...rest } = user;
    return rest;
  }

  private generateAccessToken(user: any) {
    return jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );
  }

  private generateRefreshToken() {
    return jwt.sign({}, process.env.JWT_REFRESH_SECRET || "refresh_secret", {
      expiresIn: "20d",
    });
  }

  async register(data: RegisterDto) {
    console.log("[AuthService.register] Starting with email:", data.email);
    try {
      console.log("[AuthService.register] Checking existing user...");
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new Error("Email đã được sử dụng");
      }

      console.log("[AuthService.register] Hashing password...");
      const hashedPassword = await bcrypt.hash(data.password, 10);

      console.log("[AuthService.register] Creating user in DB...");
      const newUser = await userRepository.create({
        ...data,
        password: hashedPassword,
        role_id: 1,
      });
      console.log("[AuthService.register] User created successfully:", newUser.user_id);

      return this.excludePassword(newUser);
    } catch (error: any) {
      console.error("[AuthService.register] Error:", error.message, error);
      throw error;
    }
  }

  async login(data: LoginDto) {
    const user = await userRepository.findByEmail(data.email);
    if (!user) throw new Error("Không tìm thấy người dùng");

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error("Sai mật khẩu");

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken();

    await authRepository.create({
      user_id: user.user_id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 ngày
    });

    return {
      user: this.excludePassword(user),
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(data: RefreshTokenDto) {
    const { refreshToken } = data;

    const tokenInDb = await authRepository.findByToken(refreshToken);
    if (!tokenInDb) {
      throw new Error("Refresh token không hợp lệ");
    }

    if (tokenInDb.expires_at < new Date()) {
      await authRepository.delete(refreshToken);
      throw new Error("Refresh token đã hết hạn");
    }

    try {
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || "refresh_secret"
      );
    } catch {
      await authRepository.delete(refreshToken);
      throw new Error("Refresh token không hợp lệ");
    }

    const user = await userRepository.findById(tokenInDb.user_id);
    if (!user) throw new Error("User không tồn tại");

    const newAccessToken = this.generateAccessToken(user);
    const newRefreshToken = this.generateRefreshToken();

    // Rotate refresh token for security
    await authRepository.delete(refreshToken);
    await authRepository.create({
      user_id: user.user_id,
      token: newRefreshToken,
      expires_at: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    const deletedCount = await authRepository.delete(refreshToken);

    if (deletedCount === 0) {
      throw new Error("Token không tồn tại");
    }

    return {
      message: "Đăng xuất thành công",
    };
  }

  async logoutAll(userId: number) {
    await authRepository.deleteByUserId(userId);

    return {
      message: "Đã đăng xuất tất cả thiết bị",
    };
  }
}

export const authService = new AuthService();