import { api } from "../lib/axios";
import type {
  AcademicPeriodsResponse,
  CreateAcademicPeriodInput,
  CreateAcademicPeriodResponse,
} from "../types/academicPeriods";

export const academicPeriodsService = {
  async getAll(
    accessToken: string,
    signal: AbortSignal,
  ): Promise<AcademicPeriodsResponse> {
    const response = await api.get<AcademicPeriodsResponse>(
      "/academic-periods",
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
    values: CreateAcademicPeriodInput,
  ): Promise<CreateAcademicPeriodResponse> {
    const response = await api.post<CreateAcademicPeriodResponse>(
      "/academic-periods",
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
