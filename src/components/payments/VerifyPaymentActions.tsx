import axios from "axios";
import { useRef, useState } from "react";
import { getApiErrorMessage } from "../../lib/apiError";
import { formatAmount, paymentMethodLabels } from "../../lib/finance";
import { paymentsService } from "../../services/payments";
import { useAuthStore } from "../../stores/authStore";
import type {
  ManualPaymentDecision,
  PendingManualPayment,
} from "../../types/payments";

interface VerifyPaymentActionsProps {
  payment: PendingManualPayment;
  onVerified: (paymentId: string, message: string) => void;
}

export default function VerifyPaymentActions({
  payment,
  onVerified,
}: VerifyPaymentActionsProps) {
  const [pendingDecision, setPendingDecision] =
    useState<ManualPaymentDecision | null>(null);

  const [error, setError] = useState<string | null>(null);
  const requestInProgress = useRef(false);

  async function handleVerify(status: ManualPaymentDecision) {
    if (requestInProgress.current) return;

    setError(null);

    const { accessToken, user } = useAuthStore.getState();

    if (!accessToken || user?.role !== "RECEPCIONIST") return;

    const student = payment.obligation.student.user;
    const action = status === "APPROVED" ? "aprobar" : "rechazar";

    const consequence =
      status === "APPROVED"
        ? "La obligación quedará pagada y se recalculará la mora."
        : "El pago quedará rechazado y la obligación conservará su estado.";

    const confirmed = window.confirm(
      `¿Confirmas ${action} este pago?\n\n` +
        `Estudiante: ${student.firstName} ${student.lastName}\n` +
        `Concepto: ${payment.obligation.description}\n` +
        `Método: ${paymentMethodLabels[payment.method]}\n` +
        `Importe: ${formatAmount(payment.amount)}\n` +
        `Comprobante: ${payment.receiptNumber ?? "Sin comprobante"}\n\n` +
        consequence,
    );

    if (!confirmed) return;

    requestInProgress.current = true;
    setPendingDecision(status);

    try {
      const response = await paymentsService.verifyManualPayment(
        accessToken,
        payment.id,
        status,
      );

      if (useAuthStore.getState().accessToken !== accessToken) {
        return;
      }

      onVerified(payment.id, response.message);
    } catch (error: unknown) {
      if (useAuthStore.getState().accessToken !== accessToken) {
        return;
      }

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        useAuthStore.getState().logout();
        return;
      }

      const uncertainResult =
        axios.isAxiosError(error) &&
        (!error.response || error.response.status >= 500);

      setError(
        uncertainResult
          ? "No pudimos confirmar el resultado. Actualiza la lista y revisa el estado del pago antes de repetir la acción."
          : getApiErrorMessage(error),
      );
    } finally {
      requestInProgress.current = false;
      setPendingDecision(null);
    }
  }

  return (
    <div className="mt-5 border-t border-border pt-4">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void handleVerify("APPROVED")}
          disabled={pendingDecision !== null}
          className="rounded-lg bg-brand px-4 py-3 font-medium text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
        >
          {pendingDecision === "APPROVED" ? "Aprobando…" : "Aprobar"}
        </button>

        <button
          type="button"
          onClick={() => void handleVerify("REJECTED")}
          disabled={pendingDecision !== null}
          className="rounded-lg border border-danger px-4 py-3 font-medium text-danger hover:bg-danger-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger disabled:opacity-50"
        >
          {pendingDecision === "REJECTED" ? "Rechazando…" : "Rechazar"}
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-danger-soft p-4 text-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
}
