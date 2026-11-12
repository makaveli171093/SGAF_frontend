import { api } from "../lib/axios";
import type { FinancialHistoryResponse } from "../types/payments";

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
};
