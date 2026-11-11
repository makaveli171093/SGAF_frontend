import { Link } from "react-router";
import { useEnrollments } from "../hooks/useEnrollments";
import type { DayOfWeek } from "../types/enrollments";
import type { AcademicPeriodStatus } from "../types/groups";

const dayLabels: Record<DayOfWeek, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
};

const periodLabels: Record<AcademicPeriodStatus, string> = {
  PLANNED: "Planificado",
  ACTIVE: "Activo",
  CLOSED: "Cerrado",
};

const scheduleFormatter = new Intl.DateTimeFormat("es-BO", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "UTC",
});

function formatScheduleTime(value: string) {
  return scheduleFormatter.format(new Date(value));
}

export default function MyEnrollmentsPage() {
  const { enrollments, isLoading, error, reload } = useEnrollments();

  return (
    <section aria-labelledby="enrollments-title">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            id="enrollments-title"
            className="text-2xl font-bold text-brand sm:text-3xl"
          >
            Mis inscripciones
          </h1>

          <p className="mt-2 text-ink/70">
            Consulta tus materias inscritas y sus horarios.
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
          Consultando tus inscripciones…
        </p>
      )}

      {!isLoading && error && (
        <div role="alert" className="rounded-xl bg-danger-soft p-6 text-danger">
          <p className="font-semibold">No pudimos cargar tus inscripciones</p>

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

      {!isLoading && !error && enrollments.length === 0 && (
        <div className="rounded-xl border border-border bg-surface p-6">
          <p role="status">Todavía no tienes inscripciones registradas.</p>

          <Link
            to="/grupos"
            className="mt-4 inline-block rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Consultar grupos
          </Link>
        </div>
      )}

      {!isLoading && !error && enrollments.length > 0 && (
        <div className="grid gap-5 xl:grid-cols-2">
          {enrollments.map((enrollment) => (
            <article
              key={enrollment.id}
              className="min-w-0 rounded-2xl border border-border bg-surface p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-ink/70">
                  {enrollment.group.subject.code}
                </p>

                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    enrollment.status === "ACTIVE"
                      ? "bg-success-soft text-success"
                      : "bg-canvas text-ink"
                  }`}
                >
                  {enrollment.status === "ACTIVE"
                    ? "Inscripción activa"
                    : "Inscripción cancelada"}
                </span>
              </div>

              <h2 className="mt-3 break-words text-xl font-semibold text-brand">
                {enrollment.group.subject.name}
              </h2>

              <p className="mt-2 break-words">Grupo: {enrollment.group.name}</p>

              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-ink/70">Docente</dt>
                  <dd className="mt-1 break-words font-medium">
                    {enrollment.group.teacher.user.firstName}{" "}
                    {enrollment.group.teacher.user.lastName}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-ink/70">Créditos</dt>
                  <dd className="mt-1 font-medium">
                    {enrollment.group.subject.credits}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-ink/70">Período</dt>
                  <dd className="mt-1 break-words font-medium">
                    {enrollment.group.academicPeriod.name}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-ink/70">Estado del período</dt>
                  <dd className="mt-1 font-medium">
                    {periodLabels[enrollment.group.academicPeriod.status]}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 border-t border-border pt-4">
                <h3 className="font-semibold text-brand">Horarios</h3>

                {enrollment.group.scheduleBlocks.length === 0 ? (
                  <p className="mt-2 text-sm text-ink/70">
                    Sin horarios registrados.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2 text-sm">
                    {enrollment.group.scheduleBlocks.map((block) => (
                      <li
                        key={`${block.dayOfWeek}-${block.startTime}-${block.endTime}`}
                        className="flex flex-wrap justify-between gap-2 rounded-lg bg-canvas px-3 py-2"
                      >
                        <span>{dayLabels[block.dayOfWeek]}</span>

                        <span className="font-medium">
                          {formatScheduleTime(block.startTime)}
                          {" – "}
                          {formatScheduleTime(block.endTime)}
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
