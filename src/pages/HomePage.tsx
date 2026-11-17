import AppIcon from "../components/ui/AppIcon";
import CampusArtwork from "../components/brand/CampusArtwork";
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
    { data, error, isLoading, reload } = useAuthenticatedQuery(load);
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
      <div className="home-welcome">
        <div>
          <p className="eyebrow">TU CAMPUS · {roleLabels[user.role]}</p>
          <h1>
            Hola, {user.firstName}
            <span className="text-accent">.</span>
          </h1>
          <p className="welcome-description">{messages[user.role]}</p>
        </div>
        <CampusArtwork />
      </div>
      {user.status === "SUSPEND_FOR_DEBT" && (
        <p className="mb-5 rounded-xl bg-warning-soft p-5 text-warning">
          Tu cuenta tiene obligaciones vencidas.{" "}
          <Link to="/mis-finanzas" className="font-semibold underline">
            Revisar mis finanzas
          </Link>
        </p>
      )}
      <div className="home-section-heading flex items-center justify-between gap-3">
        <div>
          <h2>Tu actividad</h2>
          <p>Lo importante, a la vista.</p>
        </div>
        <button className="btn-secondary" onClick={reload} disabled={isLoading}>
          Actualizar
        </button>
      </div>
      {isLoading && <p role="status">Consultando actividad…</p>}
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
                <div className="mb-5 flex items-center justify-between">
                  <span className="activity-icon">
                    <AppIcon
                      name={
                        card.href.includes("usuarios")
                          ? "users"
                          : card.href.includes("periodos")
                            ? "calendar"
                            : card.href.includes("finanzas") ||
                                card.href.includes("pagos") ||
                                card.href.includes("obligaciones")
                              ? "wallet"
                              : "book"
                      }
                    />
                  </span>
                  <AppIcon name="arrow" className="text-ink/35" />
                </div>
                <p className="text-sm text-ink/70">{card.label}</p>
                <p className="mt-4 text-4xl font-bold text-brand">
                  {card.value}
                </p>
                <p className="activity-detail mt-6 text-sm font-semibold text-brand">
                  Ver detalle <AppIcon name="arrow" />
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
      <div className="quick-access mt-8">
        <div>
          <p className="eyebrow">A UN CLIC</p>
          <h2>Tu espacio, siempre al día</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="btn-secondary" to="/cuenta">
            Mi cuenta
          </Link>
          {user.role === "ADMIN" && (
            <Link className="btn-primary" to="/admin/reportes">
              Métricas y reportes
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
