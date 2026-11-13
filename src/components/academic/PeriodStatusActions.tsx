import axios from "axios";
import { useRef, useState } from "react";
import { getApiErrorMessage } from "../../lib/apiError";
import { academicPeriodsService } from "../../services/academicPeriods";
import { useAuthStore } from "../../stores/authStore";
import type { AcademicPeriod } from "../../types/academicPeriods";

interface Props {
  period: AcademicPeriod;
  onUpdated: () => void;
}

export default function PeriodStatusActions({ period, onUpdated }: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const locked = useRef(false);

  async function updateStatus(status: "ACTIVE" | "CLOSED") {
    if (locked.current) return;

    const { accessToken, user } = useAuthStore.getState();
    if (!accessToken || user?.role !== "ADMIN") return;

    setError(null);

    const message =
      status === "ACTIVE"
        ? `¿Activar "${period.name}"? El período debe estar dentro de sus fechas de vigencia.`
        : `¿Cerrar "${period.name}"? El cierre es definitivo. No podrás reabrirlo y dejará de admitir nuevas inscripciones.`;

    if (!window.confirm(message)) return;

    locked.current = true;
    setPending(true);

    try {
      await academicPeriodsService.updateStatus(accessToken, period.id, status);

      if (useAuthStore.getState().accessToken !== accessToken) return;

      onUpdated();
    } catch (error: unknown) {
      if (useAuthStore.getState().accessToken !== accessToken) return;

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        useAuthStore.getState().logout();
        return;
      }

      const uncertain =
        axios.isAxiosError(error) &&
        (!error.response || error.response.status >= 500);

      setError(
        uncertain
          ? "No pudimos confirmar el cambio. Actualiza la lista antes de repetirlo."
          : getApiErrorMessage(error),
      );
    } finally {
      locked.current = false;
      setPending(false);
    }
  }

  if (period.status === "CLOSED") {
    return (
      <p className="mt-5 text-sm text-ink/70">Este período está cerrado.</p>
    );
  }

  return (
    <div className="mt-5 border-t border-border pt-4">
      <div className="flex flex-wrap gap-3">
        {period.status === "PLANNED" && (
          <button
            type="button"
            onClick={() => void updateStatus("ACTIVE")}
            disabled={pending}
            className="rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-hover disabled:opacity-50"
          >
            Activar período
          </button>
        )}

        <button
          type="button"
          onClick={() => void updateStatus("CLOSED")}
          disabled={pending}
          className="rounded-lg border border-danger px-4 py-2 font-medium text-danger hover:bg-danger-soft disabled:opacity-50"
        >
          Cerrar período
        </button>
      </div>

      {pending && (
        <p role="status" className="mt-3 text-sm">
          Actualizando estado…
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-lg bg-danger-soft p-4 text-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
}
