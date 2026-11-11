import type { UserRole, UserStatus } from "../types/auth";

export const roleLabels: Record<UserRole, string> = {
  ADMIN: "Administrador",
  RECEPCIONIST: "Recepción",
  TEACHER: "Docente",
  STUDENT: "Estudiante",
};

export const statusLabels: Record<UserStatus, string> = {
  ACTIVE: "Activo",
  PENDING_APPROVAL: "Pendiente de aprobación",
  SUSPEND_FOR_DEBT: "Suspendido por mora",
  INACTIVE: "Inactivo",
};
