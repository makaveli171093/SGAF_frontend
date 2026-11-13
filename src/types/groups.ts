export type AcademicPeriodStatus = "PLANNED" | "ACTIVE" | "CLOSED";
import type { DayOfWeek } from "./enrollments";

export interface AcademicGroup {
  id: string;
  name: string;
  maxCapacity: number;

  subject: {
    code: string;
    name: string;
    credits: number;
  };

  academicPeriod: {
    id: string;
    name: string;
    status: AcademicPeriodStatus;
  };

  teacher: {
    user: {
      firstName: string;
      lastName: string;
    };
  };

  _count: {
    enrollments: number;
  };

  scheduleBlocks: {
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
  }[];
}

export interface GroupsResponse {
  message: string;
  groups: AcademicGroup[];
}

export interface TeacherGroup {
  id: string;
  name: string;
  maxCapacity: number;

  subject: {
    code: string;
    name: string;
    credits: number;
  };

  academicPeriod: {
    name: string;
    startDate: string;
    endDate: string;
    status: AcademicPeriodStatus;
  };

  scheduleBlocks: {
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
  }[];

  _count: {
    enrollments: number;
    assignments: number;
  };
}

export interface TeacherGroupsResponse {
  message: string;
  groups: TeacherGroup[];
}
