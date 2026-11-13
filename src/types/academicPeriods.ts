import type { AcademicPeriodStatus } from "./groups";

export interface AcademicPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  maxCredits: number;
  status: AcademicPeriodStatus;
}

export interface AcademicPeriodsResponse {
  message: string;
  periods: AcademicPeriod[];
}

export interface CreateAcademicPeriodInput {
  name: string;
  startDate: string;
  endDate: string;
  maxCredits: number;
}

export interface CreateAcademicPeriodResponse {
  message: string;
  academicPeriod: AcademicPeriod;
}
