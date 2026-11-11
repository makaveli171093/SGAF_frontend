import { api } from "../lib/axios";
import type { EnrollmentsResponse } from "../types/enrollments";

export const enrollmentsService = {
  async getMine(
    accessToken: string,
    signal: AbortSignal,
  ): Promise<EnrollmentsResponse> {
    const response = await api.get<EnrollmentsResponse>(
      "/enrollments/my-enrollments",
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
