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
