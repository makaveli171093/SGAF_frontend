export type AcademicPeriodStatus = "PLANNED" | "ACTIVE" | "CLOSED";

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
}

export interface GroupsResponse {
  message: string;
  groups: AcademicGroup[];
}
