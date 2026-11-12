import { api } from "../lib/axios";
import type { StudentSubmission } from "../types/assignments";

interface CreateSubmissionInput {
  assignmentId: string;
  textContent?: string;
  fileUrl?: string;
}

interface CreateSubmissionResponse {
  message: string;
  submission: StudentSubmission;
}

export const submissionsService = {
  async create(
    accessToken: string,
    values: CreateSubmissionInput,
  ): Promise<CreateSubmissionResponse> {
    const response = await api.post<CreateSubmissionResponse>(
      "/submissions",
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
