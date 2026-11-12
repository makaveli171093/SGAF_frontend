import { Link } from "react-router";
import { useAuthenticatedQuery } from "../hooks/useAuthenticatedQuery";
import { assignmentsService } from "../services/assignments";

const dateFormatter = new Intl.DateTimeFormat("es-BO", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/La_Paz",
});

export default function TeacherAssignmentsPage() {
  const { data, isLoading, error, reload } = useAuthenticatedQuery(
    assignmentsService.getTeacherAssignments,
  );

  return (
    <section aria-labelledby="teacher-assignments-title">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            id="teacher-assignments-title"
            className="text-2xl font-bold text-brand sm:text-3xl"
          >
            Tareas publicadas
          </h1>

          <p className="mt-2 text-ink/70">
            Consulta tus actividades y revisa las entregas.
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

      <Link
        to="/docente/grupos"
        className="mb-6 inline-block font-medium text-brand underline underline-offset-4"
      >
        Ir a mis grupos para publicar una tarea
      </Link>

      {isLoading && (
        <p role="status" className="rounded-xl bg-surface p-6">
          Consultando tus tareas…
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

      {data && data.assignments.length === 0 && (
        <p role="status" className="rounded-xl bg-surface p-6">
          Todavía no tienes tareas publicadas.
        </p>
      )}

      {data && (
        <div className="space-y-5">
          {data.assignments.map((assignment) => (
            <article
              key={assignment.id}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <p className="break-words text-sm text-ink/70">
                {assignment.group.subject.name}
                {" · "}Grupo {assignment.group.name}
                {" · "}
                {assignment.group.academicPeriod.name}
              </p>

              <h2 className="mt-2 break-words text-xl font-semibold text-brand">
                {assignment.tittle}
              </h2>

              <p className="mt-3 whitespace-pre-wrap break-words">
                {assignment.instructions}
              </p>

              <p className="mt-4 text-sm text-ink/70">
                Fecha límite:{" "}
                {dateFormatter.format(new Date(assignment.dueDate))}
                {" · "}Hora de Bolivia
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="font-medium">
                  Entregas recibidas: {assignment._count.submissions}
                </p>

                <Link
                  to={`/docente/tareas/${assignment.id}/entregas`}
                  state={{ assignmentTitle: assignment.tittle }}
                  className="rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  Revisar entregas
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
