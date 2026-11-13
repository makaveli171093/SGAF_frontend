import { api } from "../lib/axios";
import { academicPeriodsService } from "./academicPeriods";
import { subjectsService } from "./subjects";
import { usersService } from "./users";
import type { ScheduleFormValues } from "../schemas/groupSetupSchema";

export interface SelectOption {
  id: string;
  label: string;
}

export interface GroupOptions {
  subjects: SelectOption[];
  periods: SelectOption[];
  teachers: SelectOption[];
}

interface CreateGroupInput {
  name: string;
  maxCapacity: number;
  subjectId: string;
  academicPeriodId: string;
  teacherId: string;
}

interface CreateScheduleInput extends ScheduleFormValues {
  groupId: string;
}

interface MutationResponse {
  message: string;
}

export const groupSetupService = {
  async getOptions(token: string, signal: AbortSignal): Promise<GroupOptions> {
    const [subjects, periods, users] = await Promise.all([
      subjectsService.getAll(token, signal),
      academicPeriodsService.getAll(token, signal),
      usersService.getAll(token, signal),
    ]);

    return {
      subjects: subjects.subjects
        .filter((subject) => subject.active)
        .map((subject) => ({
          id: subject.id,
          label: `${subject.code} — ${subject.name}`,
        })),

      periods: periods.periods
        .filter((period) => period.status !== "CLOSED")
        .map((period) => ({
          id: period.id,
          label: period.name,
        })),

      teachers: users.users.flatMap((user) =>
        user.role === "TEACHER" &&
        user.status === "ACTIVE" &&
        user.teacherProfile
          ? [
              {
                id: user.teacherProfile.id,
                label: `${user.firstName} ${user.lastName}`,
              },
            ]
          : [],
      ),
    };
  },

  async createGroup(
    token: string,
    input: CreateGroupInput,
  ): Promise<MutationResponse> {
    const response = await api.post<MutationResponse>("/groups", input, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  },

  async createSchedule(
    token: string,
    input: CreateScheduleInput,
  ): Promise<MutationResponse> {
    const response = await api.post<MutationResponse>(
      "/schedule-blocks",
      input,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return response.data;
  },
};
