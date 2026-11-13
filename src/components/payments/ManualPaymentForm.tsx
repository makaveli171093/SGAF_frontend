import axios from "axios";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getApiErrorMessage } from "../../lib/apiError";
import { formatAmount, paymentMethodLabels } from "../../lib/finance";
import {
  manualPaymentSchema,
  type ManualPaymentFormValues,
} from "../../schemas/manualPaymentSchema";
import { paymentsService } from "../../services/payments";
import { useAuthStore } from "../../stores/authStore";
import type { Payment, PendingObligation } from "../../types/payments";

interface ManualPaymentFormProps {
  obligation: PendingObligation;
}

export default function ManualPaymentForm({
  obligation,
}: ManualPaymentFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [registeredPayment, setRegisteredPayment] = useState<Payment | null>(
    null,
  );

  const requestInProgress = useRef(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ManualPaymentFormValues>({
    resolver: zodResolver(manualPaymentSchema),
    defaultValues: {
      method: "CASH",
      receiptNumber: "",
    },
  });

  const method = useWatch({
    control,
    name: "method",
  });

  async function onSubmit(values: ManualPaymentFormValues) {
    if (requestInProgress.current || registeredPayment) return;

    setServerError(null);

    const { accessToken, user } = useAuthStore.getState();

    if (!accessToken || user?.role !== "RECEPCIONIST") return;

    const studentName =
      `${obligation.student.user.firstName} ` +
      obligation.student.user.lastName;

    const confirmed = window.confirm(
      `¿Registrar el pago de ${studentName}?\n\n` +
        `Concepto: ${obligation.description}\n` +
        `Importe: ${formatAmount(obligation.amount)}\n` +
        `Método: ${paymentMethodLabels[values.method]}\n\n` +
        "Quedará pendiente de verificación.",
    );

    if (!confirmed) return;

    requestInProgress.current = true;

    try {
      const response = await paymentsService.createManualPayment(accessToken, {
        obligationId: obligation.id,
        method: values.method,
        receiptNumber:
          values.method === "BANK_TRANSFER" ? values.receiptNumber : undefined,
      });

      if (useAuthStore.getState().accessToken !== accessToken) {
        return;
      }

      setRegisteredPayment(response.payment);
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

      setServerError(
        uncertainResult
          ? "No pudimos confirmar el registro. Revisa los pagos pendientes de verificación antes de volver a intentarlo."
          : getApiErrorMessage(error),
      );
    } finally {
      requestInProgress.current = false;
    }
  }

  if (registeredPayment) {
    return (
      <div
        role="status"
        className="mt-4 rounded-lg bg-success-soft p-4 text-success"
      >
        <p className="font-semibold">
          Pago registrado, pendiente de verificación
        </p>

        <p className="mt-2">
          Método: {paymentMethodLabels[registeredPayment.method]}
        </p>

        <p className="mt-1">
          Importe: {formatAmount(registeredPayment.amount)}
        </p>

        {registeredPayment.receiptNumber && (
          <p className="mt-1 wrap-break-word">
            Comprobante: {registeredPayment.receiptNumber}
          </p>
        )}

        <p className="mt-3 text-sm">
          La obligación seguirá pendiente hasta aprobar el pago.
        </p>
      </div>
    );
  }

  const methodId = `payment-method-${obligation.id}`;
  const receiptId = `payment-receipt-${obligation.id}`;

  return (
    <form
      noValidate
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
      aria-busy={isSubmitting}
      className="mt-4 space-y-4"
    >
      <div>
        <label htmlFor={methodId} className="block text-sm font-medium">
          Método de pago
        </label>

        <select
          id={methodId}
          {...register("method")}
          disabled={isSubmitting}
          className="mt-2 w-full rounded-lg border border-border bg-surface p-3 focus:border-brand focus:outline-2 focus:outline-brand disabled:opacity-50"
        >
          <option value="CASH">Efectivo</option>
          <option value="BANK_TRANSFER">Transferencia bancaria</option>
        </select>
      </div>

      {method === "BANK_TRANSFER" ? (
        <div>
          <label htmlFor={receiptId} className="block text-sm font-medium">
            Número de comprobante
          </label>

          <input
            id={receiptId}
            {...register("receiptNumber")}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.receiptNumber)}
            aria-describedby={
              errors.receiptNumber ? `${receiptId}-error` : undefined
            }
            className="mt-2 w-full rounded-lg border border-border bg-surface p-3 focus:border-brand focus:outline-2 focus:outline-brand disabled:opacity-50"
          />

          {errors.receiptNumber && (
            <p
              id={`${receiptId}-error`}
              role="alert"
              className="mt-1 text-sm text-danger"
            >
              {errors.receiptNumber.message}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-ink/70">
          El sistema generará el número de recibo del pago en efectivo.
        </p>
      )}

      {serverError && (
        <p role="alert" className="rounded-lg bg-danger-soft p-4 text-danger">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-brand px-4 py-3 font-medium text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
      >
        {isSubmitting ? "Registrando…" : "Registrar pago"}
      </button>
    </form>
  );
}
