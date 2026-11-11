import axios from "axios";
import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../lib/apiError";
import { groupsService } from "../services/groups";
import { useAuthStore } from "../stores/authStore";
import type { AcademicGroup } from "../types/groups";

export function useGroups() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);

  const [groups, setGroups] = useState<AcademicGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!accessToken) {
      setGroups([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadGroups(token: string) {
      setIsLoading(true);
      setError(null);
      setGroups([]);

      try {
        const response = await groupsService.getAll(token, controller.signal);

        if (controller.signal.aborted) return;

        setGroups(response.groups);
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

    void loadGroups(accessToken);

    return () => {
      controller.abort();
    };
  }, [accessToken, logout, requestVersion]);

  function reload() {
    setRequestVersion((current) => current + 1);
  }

  return {
    groups,
    isLoading,
    error,
    reload,
  };
}
