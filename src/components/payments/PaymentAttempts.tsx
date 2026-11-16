import type { Payment } from "../../types/payments";
import {
  formatAmount,
  formatFinancialDate,
  paymentMethodLabels,
} from "../../lib/finance";
const labels = {
  PENDING: "Pendiente de verificación",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
};
export default function PaymentAttempts({ payments }: { payments: Payment[] }) {
  return (
    <details className="mt-5 border-t border-border pt-4">
      <summary className="cursor-pointer font-semibold text-brand">
        Intentos de pago ({payments.length})
        {payments.some((p) => p.status === "PENDING")
          ? " · Hay un pago pendiente"
          : ""}
      </summary>
      {payments.length === 0 ? (
        <p className="mt-3 text-sm text-ink/70">Sin intentos registrados.</p>
      ) : (
        <ol className="mt-4 space-y-3">
          {payments.map((payment) => (
            <li key={payment.id} className="rounded-xl bg-canvas p-4">
              <div className="flex flex-wrap justify-between gap-2">
                <strong>{labels[payment.status]}</strong>
                <span>{formatAmount(payment.amount)}</span>
              </div>
              <p className="mt-2 text-sm">
                {paymentMethodLabels[payment.method]} ·{" "}
                {formatFinancialDate(payment.createdAt)}
              </p>
              <p className="mt-1 wrap-break-word text-xs text-ink/70">
                Comprobante: {payment.receiptNumber ?? "No emitido"} ·
                Referencia: {payment.id}
              </p>
            </li>
          ))}
        </ol>
      )}
    </details>
  );
}
