import { api } from "../lib/axios";
import type {
  SubjectsResponse,
  CreateSubjectInput,
  CreateSubjectResponse,
} from "../types/subjects";

export const subjectsService = {
  async getAll(
    accessToken: string,
    signal: AbortSignal,
  ): Promise<SubjectsResponse> {
    const response = await api.get<SubjectsResponse>("/subjects", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal,
    });

    return response.data;
  },

  async create(
    accessToken: string,
    values: CreateSubjectInput,
  ): Promise<CreateSubjectResponse> {
    const response = await api.post<CreateSubjectResponse>(
      "/subjects",
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
