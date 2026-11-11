import axios from "axios";
import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../lib/apiError";
import { enrollmentsService } from "../services/enrollments";
import { useAuthStore } from "../stores/authStore";
import type { Enrollment } from "../types/enrollments";

export function useEnrollments() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!accessToken) {
      setEnrollments([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadEnrollments(token: string) {
      setIsLoading(true);
      setError(null);
      setEnrollments([]);

      try {
        const response = await enrollmentsService.getMine(
          token,
          controller.signal,
        );

        if (controller.signal.aborted) return;

        setEnrollments(response.enrollments);
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

    void loadEnrollments(accessToken);

    return () => {
      controller.abort();
    };
  }, [accessToken, logout, requestVersion]);

  function reload() {
    setRequestVersion((current) => current + 1);
  }

  return { enrollments, isLoading, error, reload };
}
