import { api } from "../lib/axios";
import type { MyAssignmentsResponse } from "../types/assignments";

export const assignmentsService = {
  async getMine(
    accessToken: string,
    signal: AbortSignal,
  ): Promise<MyAssignmentsResponse> {
    const response = await api.get<MyAssignmentsResponse>(
      "/assignments/my-assignments",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal,
      },
    );

    return response.data;
  },
};
