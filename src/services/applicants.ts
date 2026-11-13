import { api } from "../lib/axios";
import type {
  ApproveApplicantResponse,
  PendingApplicantsResponse,
} from "../types/applicants";

export const applicantsService = {
  async getPending(
    accessToken: string,
    signal: AbortSignal,
  ): Promise<PendingApplicantsResponse> {
    const response = await api.get<PendingApplicantsResponse>(
      "/users/applicants/pending",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal,
      },
    );

    return response.data;
  },

  async approve(
    accessToken: string,
    userId: string,
  ): Promise<ApproveApplicantResponse> {
    const response = await api.patch<ApproveApplicantResponse>(
      `/users/applicants/${encodeURIComponent(userId)}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  },
};
