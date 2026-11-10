import { api } from "../lib/axios";
import type {
  LoginCredentials,
  LoginResponse,
  ProfileResponse,
} from "../types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const reponse = await api.post<LoginResponse>("/auth/login", credentials);
    return reponse.data;
  },
  async getProfile(accessToken: string): Promise<ProfileResponse> {
    const response = await api.get<ProfileResponse>("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
  },
};
