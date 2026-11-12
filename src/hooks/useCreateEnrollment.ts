import axios from "axios";
import { useRef, useState } from "react";
import { getApiErrorMessage } from "../lib/apiError";
import { enrollmentsService } from "../services/enrollments";
import { useAuthStore } from "../stores/authStore";

export function useCreateEnrollment() {
  const [pendingGroupId, setPendingGroupId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const requestInProgress = useRef(false);

  async function enroll(groupId: string): Promise<boolean> {
    if (requestInProgress.current) return false;

    const { accessToken, user } = useAuthStore.getState();

    if (!accessToken || user?.role !== "STUDENT") return false;

    requestInProgress.current = true;
    setPendingGroupId(groupId);
    setError(null);
    setSuccess(null);

    try {
      const response = await enrollmentsService.create(accessToken, groupId);

      if (useAuthStore.getState().accessToken !== accessToken) {
        return false;
      }

      setSuccess(
        `${response.message}. Se generaron ${response.obligations.length} obligaciones de pago.`,
      );

      return true;
    } catch (error: unknown) {
      if (useAuthStore.getState().accessToken !== accessToken) {
        return false;
      }

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        useAuthStore.getState().logout();
        return false;
      }

      const uncertainResult =
        axios.isAxiosError(error) &&
        (!error.response || error.response.status >= 500);

      setError(
        uncertainResult
          ? "No pudimos confirmar el resultado de la solicitud. Revisa Mis inscripciones antes de volver a intentarlo."
          : getApiErrorMessage(error),
      );

      return false;
    } finally {
      requestInProgress.current = false;
      setPendingGroupId(null);
    }
  }

  return { enroll, pendingGroupId, error, success };
}
