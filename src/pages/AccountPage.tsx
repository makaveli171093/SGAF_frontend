import { useAuthStore } from "../stores/authStore";
import type { UserRole, UserStatus } from "../types/auth";

const roleLabels: Record<UserRole, string> = {
  ADMIN: "Administrador",
  RECEPCIONIST: "Recepción",
  TEACHER: "Docente",
  STUDENT: "Estudiante",
};

const statusLabels: Record<UserStatus, string> = {
  ACTIVE: "Activo",
  PENDING_APPROVAL: "Pendiente de aprobación",
  SUSPEND_FOR_DEBT: "Suspendido por mora",
  INACTIVE: "Inactivo",
};

export default function AccountPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!user) return null;

  return (
    <main className="mx-auto min-h-dvh max-w-4xl px-4 py-8 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-2xl font-bold text-brand">SGAF</p>

        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-brand px-4 py-2 font-medium text-brand hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Cerrar sesión
        </button>
      </header>

      <section className="mt-8 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <h1 className="text-2xl font-semibold text-brand">Mi cuenta</h1>

        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm">Nombre completo</dt>
            <dd className="mt-1 font-medium">
              {user.firstName} {user.lastName}
            </dd>
          </div>

          <div>
            <dt className="text-sm">Correo electrónico</dt>
            <dd className="mt-1 break-words font-medium">{user.email}</dd>
          </div>

          <div>
            <dt className="text-sm">Rol</dt>
            <dd className="mt-1 font-medium">{roleLabels[user.role]}</dd>
          </div>

          <div>
            <dt className="text-sm">Estado</dt>
            <dd className="mt-1 font-medium">{statusLabels[user.status]}</dd>
          </div>
        </dl>

        {user.status === "SUSPEND_FOR_DEBT" && (
          <p
            role="status"
            className="mt-6 rounded-lg bg-warning-soft p-4 text-warning"
          >
            Tienes obligaciones vencidas. Puedes consultar tus finanzas y
            regularizar tus pagos. Las nuevas inscripciones y entregas están
            bloqueadas.
          </p>
        )}
      </section>
    </main>
  );
}
