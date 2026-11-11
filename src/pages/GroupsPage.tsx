import { useGroups } from "../hooks/useGroups";
import type { AcademicPeriodStatus } from "../types/groups";

const periodLabels: Record<AcademicPeriodStatus, string> = {
  PLANNED: "Planificado",
  ACTIVE: "Activo",
  CLOSED: "Cerrado",
};

export default function GroupsPage() {
  const { groups, isLoading, error, reload } = useGroups();

  return (
    <section aria-labelledby="groups-title">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            id="groups-title"
            className="text-2xl font-bold text-brand sm:text-3xl"
          >
            Grupos académicos
          </h1>

          <p className="mt-2 text-ink/70">
            Consulta las materias, docentes y capacidad de los grupos
            registrados.
          </p>
        </div>

        <button
          type="button"
          onClick={reload}
          disabled={isLoading}
          className="rounded-lg border border-brand px-4 py-2 text-sm font-medium text-brand hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
        >
          {isLoading ? "Cargando…" : "Actualizar"}
        </button>
      </div>

      {isLoading && (
        <p
          role="status"
          className="rounded-xl border border-border bg-surface p-6"
        >
          Consultando los grupos académicos…
        </p>
      )}

      {!isLoading && error && (
        <div role="alert" className="rounded-xl bg-danger-soft p-6 text-danger">
          <p className="font-semibold">No pudimos cargar los grupos</p>
          <p className="mt-2">{error}</p>

          <button
            type="button"
            onClick={reload}
            className="mt-4 rounded-lg border border-current px-4 py-2 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
          >
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !error && groups.length === 0 && (
        <p
          role="status"
          className="rounded-xl border border-border bg-surface p-6 text-ink/70"
        >
          Todavía no hay grupos académicos registrados.
        </p>
      )}

      {!isLoading && !error && groups.length > 0 && (
        <>
          <p className="mb-4 text-sm text-ink/70">
            Grupos registrados: {groups.length}
          </p>

          <div className="grid gap-5 xl:grid-cols-2">
            {groups.map((group) => {
              const availableSeats = Math.max(
                0,
                group.maxCapacity - group._count.enrollments,
              );

              return (
                <article
                  key={group.id}
                  className="min-w-0 rounded-2xl border border-border bg-surface p-6"
                >
                  <p className="text-sm font-medium text-ink/70">
                    {group.subject.code}
                  </p>

                  <h2 className="mt-1 break-words text-xl font-semibold text-brand">
                    {group.subject.name}
                  </h2>

                  <p className="mt-2 break-words">Grupo: {group.name}</p>

                  <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm text-ink/70">Docente</dt>
                      <dd className="mt-1 break-words font-medium">
                        {group.teacher.user.firstName}{" "}
                        {group.teacher.user.lastName}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm text-ink/70">Créditos</dt>
                      <dd className="mt-1 font-medium">
                        {group.subject.credits}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm text-ink/70">Período</dt>
                      <dd className="mt-1 break-words font-medium">
                        {group.academicPeriod.name}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm text-ink/70">
                        Estado del período
                      </dt>
                      <dd className="mt-1 font-medium">
                        {periodLabels[group.academicPeriod.status]}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                    <p className="text-sm text-ink/70">
                      Inscripciones activas: {group._count.enrollments}
                      {" / "}
                      {group.maxCapacity}
                    </p>

                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        availableSeats > 0
                          ? "bg-success-soft text-success"
                          : "bg-warning-soft text-warning"
                      }`}
                    >
                      {availableSeats > 0
                        ? `${availableSeats} cupos libres`
                        : "Sin cupos"}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="mt-5 text-sm text-ink/70">
            Los cupos reflejan la última consulta. La inscripción también
            depende del período y de las validaciones académicas del backend.
          </p>
        </>
      )}
    </section>
  );
}
