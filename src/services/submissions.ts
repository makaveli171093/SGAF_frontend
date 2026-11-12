import { api } from "../lib/axios";
import type {
  StudentSubmission,
  AssignmentSubmissionsResponse,
} from "../types/assignments";

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
  async getByAssignment(
    accessToken: string,
    assignmentId: string,
    signal: AbortSignal,
  ): Promise<AssignmentSubmissionsResponse> {
    const response = await api.get<AssignmentSubmissionsResponse>(
      `/submissions/assignment/${encodeURIComponent(assignmentId)}`,
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
