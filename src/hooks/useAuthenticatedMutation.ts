import axios from "axios";
import { useRef, useState } from "react";
import { getApiErrorMessage } from "../lib/apiError";
import { useAuthStore } from "../stores/authStore";

export function useAuthenticatedMutation<T>(
  action: (token: string, input: T) => Promise<{ message: string }>,
) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const locked = useRef(false);

  async function execute(input: T): Promise<boolean> {
    if (locked.current) return false;

    const token = useAuthStore.getState().accessToken;
    if (!token) return false;

    locked.current = true;
    setIsPending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await action(token, input);

      if (useAuthStore.getState().accessToken !== token) return false;

      setSuccess(response.message);
      return true;
    } catch (error: unknown) {
      if (useAuthStore.getState().accessToken !== token) return false;

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        useAuthStore.getState().logout();
        return false;
      }

      const uncertain =
        axios.isAxiosError(error) &&
        (!error.response || error.response.status >= 500);

      setError(
        uncertain
          ? "No pudimos confirmar el resultado. Actualiza la lista antes de repetir la operación."
          : getApiErrorMessage(error),
      );

      return false;
    } finally {
      locked.current = false;
      setIsPending(false);
    }
  }

  return { execute, isPending, error, success };
}
