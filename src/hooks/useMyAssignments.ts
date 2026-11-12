import axios from "axios";
import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../lib/apiError";
import { assignmentsService } from "../services/assignments";
import { useAuthStore } from "../stores/authStore";
import type { StudentAssignment } from "../types/assignments";

export function useMyAssignments() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);

  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkedAt, setCheckedAt] = useState(0);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!accessToken) return;

    const controller = new AbortController();

    async function loadAssignments(token: string) {
      try {
        const response = await assignmentsService.getMine(
          token,
          controller.signal,
        );

        if (controller.signal.aborted) return;
        if (useAuthStore.getState().accessToken !== token) return;

        setAssignments(response.assignments);
        setCheckedAt(Date.now());
      } catch (error: unknown) {
        if (controller.signal.aborted) return;
        if (useAuthStore.getState().accessToken !== token) return;

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          logout();
          return;
        }

        setError(getApiErrorMessage(error));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadAssignments(accessToken);

    return () => {
      controller.abort();
    };
  }, [accessToken, logout, requestVersion]);

  function reload() {
    setIsLoading(true);
    setError(null);
    setAssignments([]);
    setRequestVersion((current) => current + 1);
  }

  return { assignments, isLoading, error, checkedAt, reload };
}
