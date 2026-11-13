import { api } from "../lib/axios";
import type { UsersResponse } from "../types/users";

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
};
