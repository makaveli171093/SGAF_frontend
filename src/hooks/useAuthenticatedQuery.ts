import axios from "axios";
import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../lib/apiError";
import { useAuthStore } from "../stores/authStore";

type QueryLoader<T> = (accessToken: string, signal: AbortSignal) => Promise<T>;

export function useAuthenticatedQuery<T>(load: QueryLoader<T>) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);

  const [result, setResult] = useState<{
    loader: QueryLoader<T>;
    version: number;
    data: T | null;
    error: string | null;
  } | null>(null);

  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!accessToken) return;

    const controller = new AbortController();

    async function execute(token: string) {
      try {
        const data = await load(token, controller.signal);

        if (controller.signal.aborted) return;
        if (useAuthStore.getState().accessToken !== token) return;

        setResult({
          loader: load,
          version: requestVersion,
          data,
          error: null,
        });
      } catch (error: unknown) {
        if (controller.signal.aborted) return;
        if (useAuthStore.getState().accessToken !== token) return;

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          logout();
          return;
        }

        setResult({
          loader: load,
          version: requestVersion,
          data: null,
          error: getApiErrorMessage(error),
        });
      }
    }

    void execute(accessToken);

    return () => {
      controller.abort();
    };
  }, [accessToken, logout, load, requestVersion]);

  function reload() {
    setRequestVersion((current) => current + 1);
  }

  function updateData(update: (current: T) => T) {
    setResult((current) => {
      if (
        !current ||
        current.loader !== load ||
        current.version !== requestVersion ||
        current.data === null
      ) {
        return current;
      }

      return {
        ...current,
        data: update(current.data),
      };
    });
  }

  const isCurrentResult =
    result?.loader === load && result?.version === requestVersion;

  return {
    data: isCurrentResult ? result.data : null,
    error: isCurrentResult ? result.error : null,
    isLoading: Boolean(accessToken) && !isCurrentResult,
    reload,
    updateData,
  };
}
