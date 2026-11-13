import { useFinancialHistory } from "../hooks/useFinancialHistory";
import {
  formatAmount,
  formatFinancialDate,
  getObligationStatus,
  obligationLabels,
  obligationStyles,
  paymentMethodLabels,
  paymentStatusLabels,
} from "../lib/finance";
import { useAuthStore } from "../stores/authStore";
import OnlinePaymentAction from "../components/payments/OnlinePaymentAction";

const onlinePaymentsEnabled =
  import.meta.env.VITE_ONLINE_PAYMENTS_ENABLED === "true";

export default function MyFinancesPage() {
  const user = useAuthStore((state) => state.user);

  const { obligations, isLoading, error, checkedAt, reload } =
    useFinancialHistory();

  return (
    <section aria-labelledby="finances-title">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            id="finances-title"
            className="text-2xl font-bold text-brand sm:text-3xl"
          >
            Mis finanzas
          </h1>

          <p className="mt-2 text-ink/70">
            Consulta tus obligaciones y el historial de sus pagos.
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
          Consultando tu información financiera…
        </p>
      )}

      {!isLoading && error && (
        <div role="alert" className="rounded-xl bg-danger-soft p-6 text-danger">
          <p className="font-semibold">No pudimos cargar tus finanzas</p>

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
          {user?.status === "SUSPEND_FOR_DEBT" && (
            <div
              role="status"
              className="mb-6 rounded-xl bg-warning-soft p-5 text-warning"
            >
              <p className="font-semibold">
                Tu cuenta tiene obligaciones vencidas
              </p>

              <p className="mt-2 text-sm">
                Las nuevas inscripciones y entregas están bloqueadas hasta
                regularizar los pagos.
              </p>
            </div>
          )}

          <p className="mb-4 text-sm text-ink/70">
            Última consulta: {formatFinancialDate(checkedAt)}
            {" · "}Hora de Bolivia
          </p>

          {obligations.length === 0 ? (
            <p
              role="status"
              className="rounded-xl border border-border bg-surface p-6"
            >
              No tienes obligaciones financieras registradas.
            </p>
          ) : (
            <div className="space-y-5">
              {obligations.map((obligation) => {
                const status = getObligationStatus(obligation, checkedAt);

                return (
                  <article
                    key={obligation.id}
                    className="rounded-2xl border border-border bg-surface p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <h2 className="min-w-0 wrap-break-word text-lg font-semibold text-brand">
                        {obligation.description}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-medium ${obligationStyles[status]}`}
                      >
                        {obligationLabels[status]}
                      </span>
                    </div>

                    <dl className="mt-5 grid gap-4 sm:grid-cols-2">
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
                    {onlinePaymentsEnabled && (
                      <OnlinePaymentAction
                        obligation={obligation}
                        onCreated={reload}
                      />
                    )}
                    <details className="mt-6 border-t border-border pt-4">
                      <summary className="cursor-pointer rounded font-medium text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                        Pagos registrados ({obligation.payments.length})
                      </summary>

                      {obligation.payments.length === 0 ? (
                        <p className="mt-4 text-sm text-ink/70">
                          No hay pagos registrados para esta obligación.
                        </p>
                      ) : (
                        <ul className="mt-4 space-y-3">
                          {obligation.payments.map((payment) => (
                            <li
                              key={payment.id}
                              className="rounded-xl bg-canvas p-4"
                            >
                              <div className="flex flex-wrap justify-between gap-2">
                                <p className="font-medium">
                                  {paymentMethodLabels[payment.method]}
                                </p>

                                <p className="text-sm font-medium">
                                  {paymentStatusLabels[payment.status]}
                                </p>
                              </div>

                              <p className="mt-2">
                                Importe: {formatAmount(payment.amount)}
                              </p>

                              <p className="mt-1 text-sm text-ink/70">
                                Registrado:{" "}
                                {formatFinancialDate(payment.createdAt)}
                              </p>

                              {payment.receiptNumber && (
                                <p className="mt-1 break-words text-sm text-ink/70">
                                  Comprobante: {payment.receiptNumber}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </details>
                  </article>
                );
              })}
            </div>
          )}

          <p className="mt-5 text-sm text-ink/70">
            Un pago pendiente de confirmación no significa que la obligación
            esté pagada. Pulsa Actualizar para consultar los últimos cambios.
          </p>

          {!onlinePaymentsEnabled && (
            <p className="mt-2 text-sm text-ink/70">
              El pago en línea no está disponible por el momento. Puedes
              consultar tus obligaciones e historial.
            </p>
          )}
        </>
      )}
    </section>
  );
}
