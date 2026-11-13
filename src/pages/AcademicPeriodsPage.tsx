import CreateAcademicPeriodForm from "../components/academic/CreateAcademicPeriodForm";
import { useAuthenticatedQuery } from "../hooks/useAuthenticatedQuery";
import { academicPeriodsService } from "../services/academicPeriods";
import type { AcademicPeriodStatus } from "../types/groups";

const periodLabels: Record<AcademicPeriodStatus, string> = {
  PLANNED: "Planificado",
  ACTIVE: "Activo",
  CLOSED: "Cerrado",
};

const dateFormatter = new Intl.DateTimeFormat("es-BO", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/La_Paz",
});

export default function AcademicPeriodsPage() {
  const { data, isLoading, error, reload } = useAuthenticatedQuery(
    academicPeriodsService.getAll,
  );

  return (
    <section aria-labelledby="periods-title">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            id="periods-title"
            className="text-2xl font-bold text-brand sm:text-3xl"
          >
            Períodos académicos
          </h1>

          <p className="mt-2 text-ink/70">
            Consulta las fechas, estados y límites de créditos.
          </p>
        </div>

        <button
          type="button"
          onClick={reload}
          disabled={isLoading}
          className="rounded-lg border border-brand px-4 py-2 font-medium text-brand hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
        >
          {isLoading ? "Cargando…" : "Actualizar"}
        </button>
      </div>

      <details className="mb-6 rounded-2xl border border-border bg-surface p-6">
        <summary className="cursor-pointer rounded font-semibold text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
          Crear período académico
        </summary>

        <CreateAcademicPeriodForm onCreated={reload} />
      </details>

      {isLoading && (
        <p role="status" className="rounded-xl bg-surface p-6">
          Consultando los períodos…
        </p>
      )}

      {error && (
        <div role="alert" className="rounded-xl bg-danger-soft p-6 text-danger">
          <p>{error}</p>

          <button
            type="button"
            onClick={reload}
            className="mt-3 rounded-lg border border-current px-4 py-2"
          >
            Reintentar
          </button>
        </div>
      )}

      {data && data.periods.length === 0 && (
        <p role="status" className="rounded-xl bg-surface p-6">
          No hay períodos académicos registrados.
        </p>
      )}

      {data && (
        <div className="grid gap-5 xl:grid-cols-2">
          {data.periods.map((period) => (
            <article
              key={period.id}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="min-w-0 wrap-break-word text-xl font-semibold text-brand">
                  {period.name}
                </h2>

                <span className="rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-brand">
                  {periodLabels[period.status]}
                </span>
              </div>

              <dl className="mt-5 space-y-4">
                <div>
                  <dt className="text-sm text-ink/70">Inicio — Bolivia</dt>
                  <dd className="mt-1 font-medium">
                    {dateFormatter.format(new Date(period.startDate))}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-ink/70">
                    Finalización — Bolivia
                  </dt>
                  <dd className="mt-1 font-medium">
                    {dateFormatter.format(new Date(period.endDate))}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-ink/70">
                    Máximo de créditos por estudiante
                  </dt>
                  <dd className="mt-1 font-medium">{period.maxCredits}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
