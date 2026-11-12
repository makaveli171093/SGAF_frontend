import axios from "axios";
import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../lib/apiError";
import { paymentsService } from "../services/payments";
import { useAuthStore } from "../stores/authStore";
import type { FinancialObligation } from "../types/payments";

export function useFinancialHistory() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);

  const [obligations, setObligations] = useState<FinancialObligation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkedAt, setCheckedAt] = useState(0);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!accessToken) return;

    const controller = new AbortController();

    async function loadHistory(token: string) {
      try {
        const response = await paymentsService.getMyHistory(
          token,
          controller.signal,
        );

        if (controller.signal.aborted) return;

        const currentSession = useAuthStore.getState();

        if (currentSession.accessToken !== token || !currentSession.user) {
          return;
        }

        setObligations(response.financialHistory);
        setCheckedAt(Date.now());

        if (currentSession.user.status !== response.userStatus) {
          currentSession.setSession(token, {
            ...currentSession.user,
            status: response.userStatus,
          });
        }
      } catch (error: unknown) {
        if (controller.signal.aborted) return;

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          if (useAuthStore.getState().accessToken === token) {
            logout();
          }

          return;
        }

        setError(getApiErrorMessage(error));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadHistory(accessToken);

    return () => {
      controller.abort();
    };
  }, [accessToken, logout, requestVersion]);

  function reload() {
    setIsLoading(true);
    setError(null);
    setObligations([]);
    setRequestVersion((current) => current + 1);
  }

  return {
    obligations,
    isLoading,
    error,
    checkedAt,
    reload,
  };
}
