import UpcomingAssignments from "../components/assignments/UpcomingAssignments";
import { ListSkeleton, RefreshButton } from "../components/ui/Loading";
import { Link } from "react-router";
import { api } from "../lib/axios";
import { useAuthStore } from "../stores/authStore";
import { useAuthenticatedQuery } from "../hooks/useAuthenticatedQuery";
import { roleLabels } from "../constants/authLabels";
async function load(token: string, signal: AbortSignal) {
  return (
    await api.get<{
      cards: { label: string; value: number; href: string }[];
      generatedAt: string;
    }>("/account/summary", {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    })
  ).data;
}
export default function HomePage() {
  const user = useAuthStore((state) => state.user),
    { data, error, isLoading, reload } = useAuthenticatedQuery(load, true);
  if (!user) return null;
  const messages = {
    ADMIN:
      "Organiza la gestión académica y consulta los resultados de la institución.",
    RECEPCIONIST:
      "Revisa los pagos por verificar y acompaña a los nuevos estudiantes.",
    TEACHER:
      "Organiza tus grupos, publica tareas y revisa las entregas pendientes.",
    STUDENT:
      "Consulta tus clases, entregas y obligaciones desde un solo lugar.",
  };
  return (
    <section>
      <div className="home-welcome mb-8 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <p className="text-sm font-semibold text-brand">
          NEXORA · {roleLabels[user.role]}
        </p>
        <h1 className="mt-3 text-3xl font-bold text-brand">
          Hola, {user.firstName}
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-ink/70">
          {messages[user.role]}
        </p>
      </div>
      {user.status === "SUSPEND_FOR_DEBT" && (
        <p className="mb-5 rounded-xl bg-warning-soft p-5 text-warning">
          Tu cuenta tiene obligaciones vencidas.{" "}
          <Link to="/mis-finanzas" className="font-semibold underline">
            Revisar mis finanzas
          </Link>
        </p>
      )}
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-brand">Tu actividad</h2>
        <RefreshButton busy={isLoading} onClick={reload} />
      </div>
      {isLoading && !data && <ListSkeleton label="Consultando actividad…" />}
      {error && (
        <p role="alert" className="rounded-xl bg-danger-soft p-5 text-danger">
          {error}
        </p>
      )}
      {data && (
        <>
          <div className="grid gap-5 md:grid-cols-3">
            {data.cards.map((card) => (
              <Link
                key={card.href + card.label}
                to={card.href}
                className="activity-card rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-brand"
              >
                <p className="text-sm text-ink/70">{card.label}</p>
                <p className="mt-4 text-4xl font-bold text-brand">
                  {card.value}
                </p>
                <p className="mt-6 text-sm font-semibold text-brand">
                  Ver detalle →
                </p>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-xs text-ink/70">
            Última consulta:{" "}
            {new Date(data.generatedAt).toLocaleString("es-BO", {
              timeZone: "America/La_Paz",
            })}{" "}
            · Bolivia
          </p>
        </>
      )}
      {(user.role === "STUDENT" || user.role === "TEACHER") && (
        <UpcomingAssignments student={user.role === "STUDENT"} />
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="btn-secondary" to="/cuenta">
          Mi cuenta
        </Link>
        {user.role === "ADMIN" && (
          <Link className="btn-primary" to="/admin/reportes">
            Métricas y reportes
          </Link>
        )}
      </div>
    </section>
  );
}
