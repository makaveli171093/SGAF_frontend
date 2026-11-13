import { useState } from "react";
import { useAuthenticatedQuery } from "../hooks/useAuthenticatedQuery";
import {
  formatAmount,
  formatFinancialDate,
  getObligationStatus,
  obligationLabels,
  obligationStyles,
} from "../lib/finance";
import { paymentsService } from "../services/payments";
import ManualPaymentForm from "../components/payments/ManualPaymentForm";

function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function PendingObligationsPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading, error, reload } = useAuthenticatedQuery(
    paymentsService.getPendingObligations,
  );

  const query = normalizeSearch(search);

  const filteredObligations =
    data?.obligations.filter((obligation) => {
      const { student } = obligation;

      const searchableText = [
        student.user.firstName,
        student.user.lastName,
        student.enrollmentCode,
        student.user.email,
      ].join(" ");

      return normalizeSearch(searchableText).includes(query);
    }) ?? [];

  return (
    <section aria-labelledby="pending-obligations-title">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            id="pending-obligations-title"
            className="text-2xl font-bold text-brand sm:text-3xl"
          >
            Obligaciones pendientes
          </h1>

          <p className="mt-2 text-ink/70">
            Consulta las obligaciones pendientes y vencidas de los estudiantes.
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

      <div className="mb-6">
        <label htmlFor="student-search" className="block text-sm font-medium">
          Buscar estudiante
        </label>

        <input
          id="student-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-describedby="student-search-help"
          className="mt-2 w-full rounded-lg border border-border bg-surface p-3 focus:border-brand focus:outline-2 focus:outline-brand"
        />

        <p id="student-search-help" className="mt-1 text-sm text-ink/70">
          Escribe su nombre, matrícula o correo electrónico.
        </p>
      </div>

      {isLoading && (
        <p
          role="status"
          className="rounded-xl border border-border bg-surface p-6"
        >
          Consultando las obligaciones…
        </p>
      )}

      {error && (
        <div role="alert" className="rounded-xl bg-danger-soft p-6 text-danger">
          <p>{error}</p>

          <button
            type="button"
            onClick={reload}
            className="mt-3 rounded-lg border border-current px-4 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
          >
            Reintentar
          </button>
        </div>
      )}

      {data && (
        <>
          <p className="mb-4 text-sm text-ink/70">
            Última consulta: {formatFinancialDate(data.checkedAt)}
            {" · "}Hora de Bolivia
          </p>

          <p role="status" className="mb-4 text-sm text-ink/70">
            Obligaciones encontradas: {filteredObligations.length}
          </p>

          {data.obligations.length === 0 ? (
            <p className="rounded-xl border border-border bg-surface p-6">
              No hay obligaciones pendientes o vencidas.
            </p>
          ) : filteredObligations.length === 0 ? (
            <p className="rounded-xl border border-border bg-surface p-6">
              No hay resultados para esa búsqueda.
            </p>
          ) : (
            <div className="space-y-5">
              {filteredObligations.map((obligation) => {
                const status = getObligationStatus(obligation, data.checkedAt);

                return (
                  <article
                    key={obligation.id}
                    className="rounded-2xl border border-border bg-surface p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="wrap-break-word text-xl font-semibold text-brand">
                          {obligation.student.user.firstName}{" "}
                          {obligation.student.user.lastName}
                        </h2>

                        <p className="mt-1 wrap-break-word text-sm text-ink/70">
                          Matrícula: {obligation.student.enrollmentCode}
                        </p>

                        <p className="mt-1 wrap-break-word text-sm text-ink/70">
                          {obligation.student.user.email}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${obligationStyles[status]}`}
                      >
                        {obligationLabels[status]}
                      </span>
                    </div>

                    <p className="mt-5 wrap-break-word font-medium">
                      {obligation.description}
                    </p>

                    <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm text-ink/70">
                          Importe de la obligación
                        </dt>
                        <dd className="mt-1 text-xl font-semibold">
                          {formatAmount(obligation.amount)}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-sm text-ink/70">Vencimiento</dt>
                        <dd className="mt-1 font-medium">
                          {formatFinancialDate(obligation.dueDate)}
                        </dd>
                      </div>
                    </dl>
                    <details className="mt-5 border-t border-border pt-4">
                      <summary className="cursor-pointer rounded font-semibold text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                        Registrar pago manual
                      </summary>

                      <ManualPaymentForm obligation={obligation} />
                    </details>
                  </article>
                );
              })}
            </div>
          )}

          <p className="mt-5 text-sm text-ink/70">
            Una obligación puede seguir pendiente mientras su pago está en
            proceso de verificación.
          </p>
        </>
      )}
    </section>
  );
}
