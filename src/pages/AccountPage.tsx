import { roleLabels, statusLabels } from "../constants/authLabels";
import { useAuthStore } from "../stores/authStore";

export default function AccountPage() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <section aria-labelledby="account-title">
      <div className="mb-6">
        <h1
          id="account-title"
          className="text-2xl font-bold text-brand sm:text-3xl"
        >
          Mi cuenta
        </h1>

        <p className="mt-2 text-ink/70">
          Consulta tus datos y el estado de tu cuenta.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-brand">
          Información personal
        </h2>

        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-ink/70">Nombre completo</dt>
            <dd className="mt-1 break-words font-medium">
              {user.firstName} {user.lastName}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-ink/70">Correo electrónico</dt>
            <dd className="mt-1 break-words font-medium">{user.email}</dd>
          </div>

          <div>
            <dt className="text-sm text-ink/70">Rol</dt>
            <dd className="mt-1 font-medium">{roleLabels[user.role]}</dd>
          </div>

          <div>
            <dt className="text-sm text-ink/70">Estado</dt>
            <dd className="mt-2">
              <span className="inline-flex rounded-full border border-border bg-canvas px-3 py-1 text-sm font-medium">
                {statusLabels[user.status]}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      {user.status === "SUSPEND_FOR_DEBT" && (
        <div
          role="status"
          className="mt-6 rounded-xl bg-warning-soft p-5 text-warning"
        >
          <p className="font-semibold">Tienes obligaciones vencidas</p>

          <p className="mt-2 text-sm">
            Las nuevas inscripciones y entregas están bloqueadas hasta
            regularizar tus pagos.
          </p>
        </div>
      )}
    </section>
  );
}
