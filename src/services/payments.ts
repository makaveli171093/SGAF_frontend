import { api } from "../lib/axios";
import type {
  FinancialHistoryResponse,
  OnlinePaymentResponse,
  PendingObligationsResponse,
  CreateManualPaymentInput,
  CreateManualPaymentResponse,
} from "../types/payments";

export const paymentsService = {
  async getMyHistory(
    accessToken: string,
    signal: AbortSignal,
  ): Promise<FinancialHistoryResponse> {
    const response = await api.get<FinancialHistoryResponse>(
      "/payments/my-history",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal,
      },
    );

    return response.data;
  },

  async createOnlinePayment(
    accessToken: string,
    obligationId: string,
  ): Promise<OnlinePaymentResponse> {
    const response = await api.post<OnlinePaymentResponse>(
      "/payments/online",
      { obligationId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  },

  async getPendingObligations(
    accessToken: string,
    signal: AbortSignal,
  ): Promise<PendingObligationsResponse & { checkedAt: number }> {
    const response = await api.get<PendingObligationsResponse>(
      "/payments/pending-obligations",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal,
      },
    );

    return {
      ...response.data,
      checkedAt: Date.now(),
    };
  },
  async createManualPayment(
    accessToken: string,
    values: CreateManualPaymentInput,
  ): Promise<CreateManualPaymentResponse> {
    const response = await api.post<CreateManualPaymentResponse>(
      "/payments/manual",
      values,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  },
};
