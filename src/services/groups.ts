import { api } from "../lib/axios";
import type { GroupsResponse } from "../types/groups";

export const groupsService = {
  async getAll(
    accessToken: string,
    signal: AbortSignal,
  ): Promise<GroupsResponse> {
    const response = await api.get<GroupsResponse>("/groups", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal,
    });

    return response.data;
  },
};
