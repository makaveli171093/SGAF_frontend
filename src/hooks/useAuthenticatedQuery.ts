import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { getApiErrorMessage } from "../lib/apiError";
import { useAuthStore } from "../stores/authStore";

type QueryLoader<T> = (accessToken: string, signal: AbortSignal) => Promise<T>;

export function useAuthenticatedQuery<T>(load: QueryLoader<T>, keepData = false) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);

  const [result, setResult] = useState<{
    loader: QueryLoader<T>;
    token: string;
    version: number;
    data: T | null;
    error: string | null;
  } | null>(null);

  const [requestVersion, setRequestVersion] = useState(0);

  const dataRevision = useRef(0);
  useEffect(() => {
    if (!accessToken) return;

    const controller = new AbortController();
    const revision = dataRevision.current;

    async function execute(token: string) {
      try {
        const data = await load(token, controller.signal);

        if (controller.signal.aborted) return;
        if (useAuthStore.getState().accessToken !== token) return;

        if (keepData && revision !== dataRevision.current) {
          setRequestVersion((current) => current + 1);
          return;
        }

        setResult({
          loader: load,
          token,
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

        setResult((previous) => ({
          loader: load,
          token,
          version: requestVersion,
          data: keepData && previous?.loader === load && previous.token === token
            ? previous.data
            : null,
          error: getApiErrorMessage(error),
        }));
      }
    }

    void execute(accessToken);

    return () => {
      controller.abort();
    };
  }, [accessToken, logout, load, requestVersion, keepData]);

  function reload() {
    setRequestVersion((current) => current + 1);
  }

  function updateData(update: (current: T) => T) {
    if (keepData) dataRevision.current++;

    setResult((current) => {
      if (
        !current ||
        current.loader !== load ||
        current.token !== accessToken ||
        (!keepData && current.version !== requestVersion) ||
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

  const sameQuery = result?.token === accessToken && result?.loader === load;
  const isCurrentResult = sameQuery && result.version === requestVersion;
  const isLoading = Boolean(accessToken) && !isCurrentResult;

  return {
    data: sameQuery && (keepData || isCurrentResult) ? result.data : null,
    error: isCurrentResult ? result.error : null,
    isLoading,
    reload,
    updateData,
  };
}
