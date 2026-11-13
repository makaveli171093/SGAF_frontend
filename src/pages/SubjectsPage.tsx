import { useState } from "react";
import CreateSubjectForm from "../components/academic/CreateSubjectForm";
import { useAuthenticatedQuery } from "../hooks/useAuthenticatedQuery";
import { formatAmount } from "../lib/finance";
import { subjectsService } from "../services/subjects";

export default function SubjectsPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading, error, reload } = useAuthenticatedQuery(
    subjectsService.getAll,
  );

  const query = search.trim().toLocaleLowerCase();

  const subjects =
    data?.subjects.filter((subject) =>
      `${subject.code} ${subject.name}`.toLocaleLowerCase().includes(query),
    ) ?? [];

  return (
    <section aria-labelledby="subjects-title">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            id="subjects-title"
            className="text-2xl font-bold text-brand sm:text-3xl"
          >
            Materias
          </h1>

          <p className="mt-2 text-ink/70">
            Administra el catálogo de materias, créditos y tarifas.
          </p>
        </div>

        <button
          type="button"
          onClick={reload}
          disabled={isLoading}
          className="rounded-lg border border-brand px-4 py-2 font-medium text-brand hover:bg-accent-soft disabled:opacity-50"
        >
          {isLoading ? "Cargando…" : "Actualizar"}
        </button>
      </div>

      <details className="mb-6 rounded-2xl border border-border bg-surface p-6">
        <summary className="cursor-pointer font-semibold text-brand">
          Crear materia
        </summary>

        <CreateSubjectForm onCreated={reload} />
      </details>

      <div className="mb-6">
        <label htmlFor="subject-search" className="block text-sm font-medium">
          Buscar por código o nombre
        </label>

        <input
          id="subject-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="mt-2 w-full rounded-lg border border-border bg-surface p-3 focus:border-brand focus:outline-2 focus:outline-brand"
        />
      </div>

      {isLoading && (
        <p role="status" className="rounded-xl bg-surface p-6">
          Consultando las materias…
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

      {data && subjects.length === 0 && (
        <p role="status" className="rounded-xl bg-surface p-6">
          {data.subjects.length === 0
            ? "No hay materias registradas."
            : "No hay materias que coincidan con la búsqueda."}
        </p>
      )}

      {data && (
        <div className="grid gap-5 xl:grid-cols-2">
          {subjects.map((subject) => (
            <article
              key={subject.id}
              className="min-w-0 rounded-2xl border border-border bg-surface p-6"
            >
              <div className="flex flex-wrap justify-between gap-3">
                <p className="text-sm font-medium text-ink/70">
                  {subject.code}
                </p>

                <span className="rounded-full bg-canvas px-3 py-1 text-sm">
                  {subject.active ? "Activa" : "Inactiva"}
                </span>
              </div>

              <h2 className="mt-3 wrap-break-word text-xl font-semibold text-brand">
                {subject.name}
              </h2>

              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-ink/70">Créditos</dt>
                  <dd className="mt-1 font-medium">{subject.credits}</dd>
                </div>

                <div>
                  <dt className="text-sm text-ink/70">
                    Inscripción a la materia
                  </dt>
                  <dd className="mt-1 font-medium">
                    {formatAmount(subject.enrollmentFee)}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-ink/70">Mensualidad</dt>
                  <dd className="mt-1 font-medium">
                    {formatAmount(subject.monthlyFee)}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
