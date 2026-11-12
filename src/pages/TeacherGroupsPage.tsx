import { useTeacherGroups } from "../hooks/useTeacherGroups";
import type { DayOfWeek } from "../types/enrollments";
import type { AcademicPeriodStatus } from "../types/groups";

const periodLabels: Record<AcademicPeriodStatus, string> = {
  PLANNED: "Planificado",
  ACTIVE: "Activo",
  CLOSED: "Cerrado",
};

const dayLabels: Record<DayOfWeek, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
};

const timeFormatter = new Intl.DateTimeFormat("es-BO", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "UTC",
});

function formatTime(value: string) {
  return timeFormatter.format(new Date(value));
}

export default function TeacherGroupsPage() {
  const { groups, isLoading, error, reload } = useTeacherGroups();

  return (
    <section aria-labelledby="teacher-groups-title">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            id="teacher-groups-title"
            className="text-2xl font-bold text-brand sm:text-3xl"
          >
            Mis grupos
          </h1>

          <p className="mt-2 text-ink/70">
            Consulta tus grupos asignados y sus horarios.
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
          Consultando tus grupos…
        </p>
      )}

      {!isLoading && error && (
        <div role="alert" className="rounded-xl bg-danger-soft p-6 text-danger">
          <p className="font-semibold">No pudimos cargar tus grupos</p>

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
          className="rounded-xl border border-border bg-surface p-6"
        >
          Todavía no tienes grupos asignados.
        </p>
      )}

      {!isLoading && !error && groups.length > 0 && (
        <div className="grid gap-5 xl:grid-cols-2">
          {groups.map((group) => (
            <article
              key={group.id}
              className="min-w-0 rounded-2xl border border-border bg-surface p-6"
            >
              <p className="text-sm text-ink/70">{group.subject.code}</p>

              <h2 className="mt-1 break-words text-xl font-semibold text-brand">
                {group.subject.name}
              </h2>

              <p className="mt-2 break-words">Grupo: {group.name}</p>

              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-ink/70">Período</dt>
                  <dd className="mt-1 break-words font-medium">
                    {group.academicPeriod.name}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-ink/70">Estado del período</dt>
                  <dd className="mt-1 font-medium">
                    {periodLabels[group.academicPeriod.status]}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-ink/70">
                    Inscripciones activas / capacidad
                  </dt>
                  <dd className="mt-1 font-medium">
                    {group._count.enrollments} / {group.maxCapacity}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-ink/70">Tareas publicadas</dt>
                  <dd className="mt-1 font-medium">
                    {group._count.assignments}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 border-t border-border pt-4">
                <h3 className="font-semibold text-brand">Horarios</h3>

                {group.scheduleBlocks.length === 0 ? (
                  <p className="mt-2 text-sm text-ink/70">
                    Sin horarios registrados.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2 text-sm">
                    {group.scheduleBlocks.map((block) => (
                      <li
                        key={`${block.dayOfWeek}-${block.startTime}-${block.endTime}`}
                        className="flex flex-wrap justify-between gap-2 rounded-lg bg-canvas px-3 py-2"
                      >
                        <span>{dayLabels[block.dayOfWeek]}</span>

                        <span className="font-medium">
                          {formatTime(block.startTime)}
                          {" – "}
                          {formatTime(block.endTime)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
