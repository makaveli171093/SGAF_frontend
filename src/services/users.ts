import { api } from "../lib/axios";
import type {
  UsersResponse,
  CreateStaffInput,
  CreateStaffResponse,
} from "../types/users";

export const usersService = {
  async getAll(
    accessToken: string,
    signal: AbortSignal,
  ): Promise<UsersResponse> {
    const response = await api.get<UsersResponse>("/users", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal,
    });

    return response.data;
  },

  async createStaff(
    accessToken: string,
    values: CreateStaffInput,
  ): Promise<CreateStaffResponse> {
    const response = await api.post<CreateStaffResponse>(
      "/users/staff",
      values,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  },
};
