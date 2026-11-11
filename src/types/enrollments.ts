import type { AcademicPeriodStatus } from "./groups";

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

export interface Enrollment {
  id: string;
  status: "ACTIVE" | "CANCELLED";
  enrolledAt: string;

  group: {
    name: string;

    subject: {
      code: string;
      name: string;
      credits: number;
    };

    academicPeriod: {
      name: string;
      status: AcademicPeriodStatus;
    };

    teacher: {
      user: {
        firstName: string;
        lastName: string;
      };
    };

    scheduleBlocks: {
      dayOfWeek: DayOfWeek;
      startTime: string;
      endTime: string;
    }[];
  };
}

export interface EnrollmentsResponse {
  message: string;
  enrollments: Enrollment[];
}
