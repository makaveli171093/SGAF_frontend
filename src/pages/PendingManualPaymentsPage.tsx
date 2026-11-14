import { useState } from "react";
import VerifyPaymentActions from "../components/payments/VerifyPaymentActions";
import { useAuthenticatedQuery } from "../hooks/useAuthenticatedQuery";
import {
  formatAmount,
  formatFinancialDate,
  paymentMethodLabels,
} from "../lib/finance";
import { paymentsService } from "../services/payments";

export default function PendingManualPaymentsPage() {
  const [success, setSuccess] = useState<string | null>(null);

  const { data, isLoading, error, reload, updateData } = useAuthenticatedQuery(
    paymentsService.getPendingManualPayments,
  );

  function handleVerified(paymentId: string, message: string) {
    updateData((current) => ({
      ...current,
      payments: current.payments.filter((payment) => payment.id !== paymentId),
    }));

    setSuccess(message);
  }

  function handleReload() {
    setSuccess(null);
    reload();
  }

  return (
    <section aria-labelledby="pending-payments-title">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            id="pending-payments-title"
            className="text-2xl font-bold text-brand sm:text-3xl"
          >
            Pagos por verificar
          </h1>

          <p className="mt-2 text-ink/70">
            Revisa los pagos en efectivo y transferencia antes de aprobarlos o
            rechazarlos.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReload}
          disabled={isLoading}
          className="rounded-lg border border-brand px-4 py-2 font-medium text-brand hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
        >
          {isLoading ? "Cargando…" : "Actualizar"}
        </button>
      </div>

      {success && (
        <p
          role="status"
          className="mb-5 rounded-xl bg-success-soft p-5 text-success"
        >
          {success}
        </p>
      )}

      {isLoading && (
        <p
          role="status"
          className="rounded-xl border border-border bg-surface p-6"
        >
          Consultando los pagos pendientes…
        </p>
      )}

      {error && (
        <div role="alert" className="rounded-xl bg-danger-soft p-6 text-danger">
          <p>{error}</p>

          <button
            type="button"
            onClick={handleReload}
            className="mt-3 rounded-lg border border-current px-4 py-2"
          >
            Reintentar
          </button>
        </div>
      )}

      {data && data.payments.length === 0 && (
        <p
          role="status"
          className="rounded-xl border border-border bg-surface p-6"
        >
          No hay pagos manuales pendientes de verificación.
        </p>
      )}

      {data && (
        <div className="space-y-5">
          {data.payments.map((payment) => (
            <article
              key={payment.id}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <h2 className="wrap-break-words text-xl font-semibold text-brand">
                {payment.obligation.student.user.firstName}{" "}
                {payment.obligation.student.user.lastName}
              </h2>

              <p className="mt-1 text-sm text-ink/70">
                Matrícula: {payment.obligation.student.enrollmentCode}
              </p>

              <p className="mt-4 wrap-break-word font-medium">
                {payment.obligation.description}
              </p>

              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-ink/70">Importe del pago</dt>
                  <dd className="mt-1 text-xl font-semibold">
                    {formatAmount(payment.amount)}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-ink/70">Método</dt>
                  <dd className="mt-1 font-medium">
                    {paymentMethodLabels[payment.method]}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-ink/70">Comprobante</dt>
                  <dd className="mt-1 wrap-break-word font-medium">
                    {payment.receiptNumber ?? "Sin comprobante"}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-ink/70">
                    Fecha de registro — Bolivia
                  </dt>
                  <dd className="mt-1 font-medium">
                    {formatFinancialDate(payment.createdAt)}
                  </dd>
                </div>
              </dl>

              <VerifyPaymentActions
                payment={payment}
                onVerified={handleVerified}
              />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
