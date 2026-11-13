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
