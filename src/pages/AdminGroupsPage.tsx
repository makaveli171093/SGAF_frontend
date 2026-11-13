import CreateGroupForm from "../components/academic/CreateGroupForm";
import CreateScheduleForm from "../components/academic/CreateScheduleForm";
import { scheduleDayLabels } from "../constants/scheduleLabels";
import { useAuthenticatedQuery } from "../hooks/useAuthenticatedQuery";
import { groupsService } from "../services/groups";
import { groupSetupService } from "../services/groupSetup";

const timeFormatter = new Intl.DateTimeFormat("es-BO", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "UTC",
});

export default function AdminGroupsPage() {
  const groupsQuery = useAuthenticatedQuery(groupsService.getAll);
  const optionsQuery = useAuthenticatedQuery(groupSetupService.getOptions);

  function reloadAll() {
    groupsQuery.reload();
    optionsQuery.reload();
  }

  return (
    <section aria-labelledby="admin-groups-title">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            id="admin-groups-title"
            className="text-2xl font-bold text-brand sm:text-3xl"
          >
            Grupos y horarios
          </h1>
          <p className="mt-2 text-ink/70">
            Organiza materias, docentes, capacidad y horarios de clase.
          </p>
        </div>

        <button
          type="button"
          onClick={reloadAll}
          disabled={groupsQuery.isLoading || optionsQuery.isLoading}
          className="rounded-lg border border-brand px-4 py-2 font-medium text-brand hover:bg-accent-soft disabled:opacity-50"
        >
          Actualizar
        </button>
      </div>

      <details className="mb-6 rounded-2xl border border-border bg-surface p-6">
        <summary className="cursor-pointer font-semibold text-brand">
          Crear grupo
        </summary>

        {optionsQuery.isLoading && (
          <p role="status" className="mt-4">
            Cargando materias, períodos y docentes…
          </p>
        )}

        {optionsQuery.error && (
          <div
            role="alert"
            className="mt-4 rounded-lg bg-danger-soft p-4 text-danger"
          >
            <p>{optionsQuery.error}</p>
            <button
              type="button"
              onClick={optionsQuery.reload}
              className="mt-3 underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {optionsQuery.data && (
          <CreateGroupForm
            options={optionsQuery.data}
            onCreated={groupsQuery.reload}
          />
        )}
      </details>

      {groupsQuery.isLoading && (
        <p role="status" className="rounded-xl bg-surface p-6">
          Consultando grupos…
        </p>
      )}

      {groupsQuery.error && (
        <div role="alert" className="rounded-xl bg-danger-soft p-6 text-danger">
          <p>{groupsQuery.error}</p>
          <button
            type="button"
            onClick={groupsQuery.reload}
            className="mt-3 underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {groupsQuery.data?.groups.length === 0 && (
        <p role="status" className="rounded-xl bg-surface p-6">
          No hay grupos registrados.
        </p>
      )}

      {groupsQuery.data && (
        <div className="space-y-5">
          {groupsQuery.data.groups.map((group) => (
            <article
              key={group.id}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <h2 className="wrap-break-word text-xl font-semibold text-brand">
                {group.subject.name} — {group.name}
              </h2>

              <p className="mt-2 text-sm text-ink/70">
                Período: {group.academicPeriod.name}
              </p>

              <p className="mt-2">
                Docente: {group.teacher.user.firstName}{" "}
                {group.teacher.user.lastName}
              </p>

              <p className="mt-2">
                Inscripciones activas: {group._count.enrollments}
                {" / "}
                {group.maxCapacity}
              </p>

              <h3 className="mt-5 font-semibold text-brand">Horarios</h3>

              {group.scheduleBlocks.length === 0 ? (
                <p className="mt-2 text-sm text-warning">
                  Sin horarios registrados. Configúralos antes de inscribir
                  estudiantes.
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {group.scheduleBlocks.map((block) => (
                    <li
                      key={`${block.dayOfWeek}-${block.startTime}-${block.endTime}`}
                      className="flex flex-wrap justify-between gap-2 rounded-lg bg-canvas p-3"
                    >
                      <span>{scheduleDayLabels[block.dayOfWeek]}</span>
                      <span>
                        {timeFormatter.format(new Date(block.startTime))}
                        {" – "}
                        {timeFormatter.format(new Date(block.endTime))}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {group.academicPeriod.status !== "CLOSED" && (
                <details className="mt-5 border-t border-border pt-4">
                  <summary className="cursor-pointer font-semibold text-brand">
                    Agregar horario
                  </summary>

                  <CreateScheduleForm
                    groupId={group.id}
                    groupName={`${group.subject.name} — ${group.name}`}
                    onCreated={groupsQuery.reload}
                  />
                </details>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
