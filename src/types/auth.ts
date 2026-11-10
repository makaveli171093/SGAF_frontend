export type UserRole = "ADMIN" | "RECEPCIONIST" | "TEACHER" | "STUDENT";

export type UserStatus =
  | "PENDING_APPROVAL"
  | "ACTIVE"
  | "SUSPEND_FOR_DEBT"
  | "INACTIVE";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface ProfileResponse {
  user: User;
}
