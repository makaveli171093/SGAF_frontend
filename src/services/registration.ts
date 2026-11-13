import { api } from "../lib/axios";
import type {
  RegisterStudentInput,
  RegisterStudentResponse,
} from "../types/registration";

export const registrationService = {
  async register(
    values: RegisterStudentInput,
  ): Promise<RegisterStudentResponse> {
    const response = await api.post<RegisterStudentResponse>(
      "/auth/register",
      values,
    );

    return response.data;
  },
};
