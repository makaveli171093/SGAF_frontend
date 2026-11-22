import type { StudentAssignment, TeacherAssignment } from "../../types/assignments";
import { useCurrentTime } from "../../hooks/useCurrentTime";
import { Link } from "react-router";
import { ListSkeleton, RefreshButton } from "../ui/Loading";
import { useAuthenticatedQuery } from "../../hooks/useAuthenticatedQuery";
import { upcomingAssignments } from "../../lib/assignmentLists";
import { assignmentsService } from "../../services/assignments";

async function loadStudentAssignments(token: string, signal: AbortSignal) {
  return (await assignmentsService.getMine(token, signal)).assignments;
}

async function loadTeacherAssignments(token: string, signal: AbortSignal) {
  return (await assignmentsService.getTeacherAssignments(token, signal)).assignments;
}

const dueDateFormatter = new Intl.DateTimeFormat("es-BO", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/La_Paz",
});

export default function UpcomingAssignments({ student }: { student: boolean }) {
  const { data, isLoading, error, reload } = useAuthenticatedQuery<(StudentAssignment | TeacherAssignment)[]>(
    student ? loadStudentAssignments : loadTeacherAssignments,
    true,
  );
  const upcoming = upcomingAssignments(data ?? [], useCurrentTime());

  return (
    <section aria-labelledby="upcoming-heading" className="mt-8 rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="upcoming-heading" className="text-lg font-semibold text-brand">Tareas próximas a vencer</h2>
        <RefreshButton busy={isLoading} onClick={reload} />
      </div>
      {isLoading && !data && <ListSkeleton label="Consultando vencimientos…" />}
      {error && <p role="alert" className="mb-3 rounded-lg bg-danger-soft p-3 text-danger">{error}</p>}
      {data && (
        <>
          <p className="mb-3 text-sm text-ink/70">
            {upcoming.length === 0
              ? "No hay tareas próximas a vencer en los siguientes 7 días."
              : `${upcoming.length} ${upcoming.length === 1 ? "tarea vence" : "tareas vencen"} en los siguientes 7 días · Hora de Bolivia`}
          </p>
          {upcoming.length > 0 && (
            <ul className="divide-y divide-border">
              {upcoming.slice(0, 3).map((assignment) => (
                <li key={assignment.id} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-2">
                  <span className="min-w-0 wrap-break-word font-medium">{assignment.tittle}</span>
                  <time className="text-sm text-ink/70" dateTime={assignment.dueDate}>
                    {dueDateFormatter.format(new Date(assignment.dueDate))}
                  </time>
                </li>
              ))}
            </ul>
          )}
          <Link to={student ? "/mis-tareas" : "/docente/tareas"} className="mt-3 inline-block font-semibold text-brand underline underline-offset-4">
            Ver tareas
          </Link>
        </>
      )}
    </section>
  );
}
