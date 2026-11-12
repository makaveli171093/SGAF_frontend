import { api } from "../lib/axios";
import type {
  EnrollmentsResponse,
  CreateEnrollmentResponse,
} from "../types/enrollments";

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

  async create(
    accessToken: string,
    groupId: string,
  ): Promise<CreateEnrollmentResponse> {
    const response = await api.post<CreateEnrollmentResponse>(
      "/enrollments",
      { groupId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  },
};
