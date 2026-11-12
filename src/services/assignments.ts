import { api } from "../lib/axios";
import type {
  MyAssignmentsResponse,
  TeacherAssignmentsResponse,
} from "../types/assignments";

interface CreateAssignmentInput {
  groupId: string;
  title: string;
  instructions: string;
  dueDate: string;
}

interface CreateAssignmentResponse {
  message: string;
  assignment: {
    id: string;
    tittle: string;
    dueDate: string;
  };
}

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
  async create(
    accessToken: string,
    values: CreateAssignmentInput,
  ): Promise<CreateAssignmentResponse> {
    const response = await api.post<CreateAssignmentResponse>(
      "/assignments",
      values,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  },
  async getTeacherAssignments(
    accessToken: string,
    signal: AbortSignal,
  ): Promise<TeacherAssignmentsResponse> {
    const response = await api.get<TeacherAssignmentsResponse>(
      "/assignments/teacher",
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
