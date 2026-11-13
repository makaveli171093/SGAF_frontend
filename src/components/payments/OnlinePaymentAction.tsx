import axios from "axios";
import { useRef, useState } from "react";
import { getApiErrorMessage } from "../../lib/apiError";
import { paymentsService } from "../../services/payments";
import { useAuthStore } from "../../stores/authStore";
import type { FinancialObligation } from "../../types/payments";

interface OnlinePaymentActionProps {
  obligation: FinancialObligation;
  onCreated: () => void;
}

function getCheckoutUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;

  try {
    const url = new URL(value);

    if (url.protocol !== "https:") return null;
    if (url.username || url.password) return null;

    return url.href;
  } catch {
    return null;
  }
}

export default function OnlinePaymentAction({
  obligation,
  onCreated,
}: OnlinePaymentActionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);

  const requestInProgress = useRef(false);

  const pendingOnlinePayment = obligation.payments.find(
    (payment) => payment.method === "ONLINE" && payment.status === "PENDING",
  );

  const hasPendingManualPayment = obligation.payments.some(
    (payment) => payment.method !== "ONLINE" && payment.status === "PENDING",
  );

  const checkoutUrl =
    createdUrl ??
    getCheckoutUrl(pendingOnlinePayment?.gatewayResponse?.checkout_url);

  const isSettled =
    obligation.status === "PAID" || obligation.status === "CACELLED";

  async function handleCreatePayment() {
    if (
      requestInProgress.current ||
      isSettled ||
      pendingOnlinePayment ||
      hasPendingManualPayment ||
      createdUrl
    ) {
      return;
    }

    const { accessToken, user } = useAuthStore.getState();

    if (!accessToken || user?.role !== "STUDENT") return;

    requestInProgress.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await paymentsService.createOnlinePayment(
        accessToken,
        obligation.id,
      );

      if (useAuthStore.getState().accessToken !== accessToken) {
        return;
      }

      const url = getCheckoutUrl(response.checkoutUrl);

      if (!url) {
        setError(
          "El pago fue preparado, pero no recibimos un enlace HTTPS válido. Actualiza el historial antes de continuar.",
        );
        return;
      }

      setCreatedUrl(url);
      onCreated();
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
          ? "No pudimos confirmar si se generó el pago. Actualiza el historial antes de volver a intentarlo."
          : getApiErrorMessage(error),
      );
    } finally {
      requestInProgress.current = false;
      setIsSubmitting(false);
    }
  }

  if (isSettled) return null;

  return (
    <div className="mt-5 border-t border-border pt-4">
      {checkoutUrl ? (
        <div>
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-brand px-4 py-3 font-medium text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Continuar pago en MockPay
          </a>

          <p className="mt-2 text-sm text-ink/70">
            Se abrirá otra pestaña. Revisa el importe y la moneda antes de
            confirmar. Al terminar, vuelve aquí y pulsa Actualizar.
          </p>
        </div>
      ) : pendingOnlinePayment ? (
        <p role="status" className="text-sm text-warning">
          Hay un pago en línea pendiente, pero su enlace no está disponible.
          Actualiza el historial; si continúa igual, consulta con recepción.
        </p>
      ) : hasPendingManualPayment ? (
        <p role="status" className="text-sm text-warning">
          Hay un pago presencial pendiente de verificación. Consulta con
          recepción antes de iniciar otro pago.
        </p>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => void handleCreatePayment()}
            disabled={isSubmitting}
            className="rounded-lg bg-brand px-4 py-3 font-medium text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
          >
            {isSubmitting ? "Preparando pago…" : "Preparar pago en línea"}
          </button>

          <p className="mt-2 text-sm text-ink/70">
            Genera un enlace para continuar en MockPay. Esta acción no confirma
            el pago.
          </p>
        </div>
      )}

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
