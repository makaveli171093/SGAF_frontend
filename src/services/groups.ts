import { api } from "../lib/axios";
import type { GroupsResponse, TeacherGroupsResponse } from "../types/groups";

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

  async getMine(
    accessToken: string,
    signal: AbortSignal,
  ): Promise<TeacherGroupsResponse> {
    const response = await api.get<TeacherGroupsResponse>("/groups/my-groups", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal,
    });

    return response.data;
  },
};
