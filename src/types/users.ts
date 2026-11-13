import type { User } from "./auth";

export interface SystemUser extends User {
  ci: string;
  createdAt: string;

  stundentProfile: {
    enrollmentCode: string;
  } | null;

  teacherProfile: {
    id: string;
    specialty: string;
    hireDate: string;
  } | null;
}

export interface UsersResponse {
  message: string;
  users: SystemUser[];
}

export type StaffRole = "ADMIN" | "RECEPCIONIST" | "TEACHER";

export interface CreateStaffInput {
  firstName: string;
  lastName: string;
  ci: string;
  phone?: string;
  email: string;
  password: string;
  role: StaffRole;
  specialty?: string;
  hireDate?: string;
}

export interface CreateStaffResponse {
  message: string;
  user: User & {
    teacherProfile: {
      id: string;
      specialty: string;
      hireDate: string;
    } | null;
  };
}
