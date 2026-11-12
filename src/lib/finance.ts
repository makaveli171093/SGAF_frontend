import type {
  FinancialObligation,
  ObligationStatus,
  PaymentMethod,
  PaymentStatus,
} from "../types/payments";

export const obligationLabels: Record<ObligationStatus, string> = {
  PENDING: "Pendiente",
  PAID: "Pagada",
  OVERDUE: "Vencida",
  CACELLED: "Cancelada",
};

export const obligationStyles: Record<ObligationStatus, string> = {
  PENDING: "bg-warning-soft text-warning",
  PAID: "bg-success-soft text-success",
  OVERDUE: "bg-danger-soft text-danger",
  CACELLED: "bg-canvas text-ink",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  PENDING: "Pendiente de confirmación",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  CASH: "Efectivo",
  BANK_TRANSFER: "Transferencia bancaria",
  ONLINE: "En línea",
};

const amountFormatter = new Intl.NumberFormat("es-BO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("es-BO", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/La_Paz",
});

export function formatAmount(value: string | number): string {
  return amountFormatter.format(Number(value));
}

export function formatFinancialDate(value: string | number): string {
  return dateFormatter.format(new Date(value));
}

export function getObligationStatus(
  obligation: FinancialObligation,
  checkedAt: number,
): ObligationStatus {
  if (obligation.status === "PAID" || obligation.status === "CACELLED") {
    return obligation.status;
  }

  if (new Date(obligation.dueDate).getTime() < checkedAt) {
    return "OVERDUE";
  }

  return obligation.status;
}
