import type { UserStatus } from "./auth";

export type ObligationStatus = "PENDING" | "PAID" | "OVERDUE" | "CACELLED";

export type PaymentStatus = "PENDING" | "APPROVED" | "REJECTED";

export type PaymentMethod = "CASH" | "BANK_TRANSFER" | "ONLINE";

export interface Payment {
  id: string;
  amount: string | number;
  method: PaymentMethod;
  status: PaymentStatus;
  receiptNumber: string | null;
  createdAt: string;
  gatewayResponse?: {
    checkout_url?: string;
  } | null;
}

export interface FinancialObligation {
  id: string;
  type: "ENROLLMENT" | "MONTHLY_FEE" | "OTHER";
  description: string;
  amount: string | number;
  dueDate: string;
  status: ObligationStatus;
  payments: Payment[];
}

export interface FinancialHistoryResponse {
  message: string;
  financialHistory: FinancialObligation[];
  userStatus: UserStatus;
}

export interface OnlinePaymentResponse {
  message: string;
  checkoutUrl: string;

  payment: {
    id: string;
    status: PaymentStatus;
    amount: string | number;
    externalReference: string | null;
  };
}

export interface PendingObligation {
  id: string;
  type: FinancialObligation["type"];
  description: string;
  amount: string | number;
  dueDate: string;
  status: ObligationStatus;

  student: {
    enrollmentCode: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export interface PendingObligationsResponse {
  message: string;
  obligations: PendingObligation[];
}
