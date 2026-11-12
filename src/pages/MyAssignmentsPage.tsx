import { useMyAssignments } from "../hooks/useMyAssignments";
import SubmissionForm from "../components/assignments/SubmissionForm";

const dateFormatter = new Intl.DateTimeFormat("es-BO", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/La_Paz",
});

function formatDate(value: string | number) {
  return dateFormatter.format(new Date(value));
}

function getAttachmentUrl(value: string | null): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }

    if (url.username || url.password) return null;

    return url.href;
  } catch {
    return null;
  }
}

export default function MyAssignmentsPage() {
  const {
    assignments,
    isLoading,
    error,
    checkedAt,
    reload,
    registerSubmission,
  } = useMyAssignments();

  return (
    <section aria-labelledby="assignments-title">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            id="assignments-title"
            className="text-2xl font-bold text-brand sm:text-3xl"
          >
            Mis tareas
          </h1>

          <p className="mt-2 text-ink/70">
            Consulta tus actividades, entregas y calificaciones.
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
          Consultando tus tareas…
        </p>
      )}

      {!isLoading && error && (
        <div role="alert" className="rounded-xl bg-danger-soft p-6 text-danger">
          <p className="font-semibold">No pudimos cargar tus tareas</p>

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

      {!isLoading && !error && (
        <>
          <p className="mb-4 text-sm text-ink/70">
            Última consulta: {formatDate(checkedAt)}
            {" · "}Hora de Bolivia
          </p>

          {assignments.length === 0 ? (
            <p
              role="status"
              className="rounded-xl border border-border bg-surface p-6"
            >
              No hay tareas para tus inscripciones activas.
            </p>
          ) : (
            <div className="space-y-5">
              {assignments.map((assignment) => {
                const submission = assignment.submissions[0];

                const isExpired =
                  new Date(assignment.dueDate).getTime() < checkedAt;

                const attachmentUrl = getAttachmentUrl(
                  submission?.fileUrl ?? null,
                );

                const statusLabel = submission
                  ? submission.grade !== null
                    ? "Calificada"
                    : "Entregada"
                  : isExpired
                    ? "Sin entrega · Plazo finalizado"
                    : "Pendiente de entrega";

                const statusStyle = submission
                  ? "bg-success-soft text-success"
                  : isExpired
                    ? "bg-danger-soft text-danger"
                    : "bg-warning-soft text-warning";

                return (
                  <article
                    key={assignment.id}
                    className="rounded-2xl border border-border bg-surface p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <p className="min-w-0 wrap-break-word text-sm text-ink/70">
                        {assignment.group.subject.name}
                        {" · "}Grupo {assignment.group.name}
                      </p>

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${statusStyle}`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <h2 className="mt-3 wrap-break-word text-xl font-semibold text-brand">
                      {assignment.tittle}
                    </h2>

                    <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm text-ink/70">Docente</dt>
                        <dd className="mt-1 wrap-break-word font-medium">
                          {assignment.group.teacher.user.firstName}{" "}
                          {assignment.group.teacher.user.lastName}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-sm text-ink/70">Fecha límite</dt>
                        <dd className="mt-1 font-medium">
                          {formatDate(assignment.dueDate)}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-5">
                      <h3 className="font-semibold text-brand">
                        Instrucciones
                      </h3>

                      <p className="mt-2 whitespace-pre-wrap wrap-break-word">
                        {assignment.instructions}
                      </p>
                    </div>

                    {submission && (
                      <div className="mt-6 border-t border-border pt-5">
                        <h3 className="font-semibold text-brand">Tu entrega</h3>

                        <p className="mt-2 text-sm text-ink/70">
                          Enviada: {formatDate(submission.submittedAt)}
                        </p>

                        {submission.textContent && (
                          <p className="mt-3 whitespace-pre-wrap wrap-break-word rounded-lg bg-canvas p-4">
                            {submission.textContent}
                          </p>
                        )}

                        {attachmentUrl && (
                          <a
                            href={attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-block font-medium text-brand underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                          >
                            Abrir archivo o enlace entregado
                          </a>
                        )}

                        {submission.fileUrl && !attachmentUrl && (
                          <p className="mt-3 text-sm text-warning">
                            El enlace registrado no tiene un formato válido.
                          </p>
                        )}

                        <div className="mt-4 rounded-lg bg-canvas p-4">
                          <p className="font-medium">
                            {submission.grade !== null
                              ? `Calificación: ${submission.grade} / 100`
                              : "Pendiente de calificación"}
                          </p>

                          {submission.feedback && (
                            <div className="mt-3">
                              <p className="text-sm font-semibold">
                                Comentarios del docente
                              </p>

                              <p className="mt-1 whitespace-pre-wrap wrap-break-word">
                                {submission.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {!submission && !isExpired && (
                      <SubmissionForm
                        assignmentId={assignment.id}
                        dueDate={assignment.dueDate}
                        onSubmitted={(createdSubmission) =>
                          registerSubmission(assignment.id, createdSubmission)
                        }
                      />
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </section>
  );
}
