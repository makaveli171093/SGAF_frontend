import axios from "axios";
import { useRef, useState } from "react";
import { Link } from "react-router";
import { useAuthenticatedQuery } from "../hooks/useAuthenticatedQuery";
import { getApiErrorMessage } from "../lib/apiError";
import {
  formatAmount,
  obligationLabels,
  obligationStyles,
} from "../lib/finance";
import { applicantsService } from "../services/applicants";
import { useAuthStore } from "../stores/authStore";
import type { PendingApplicant } from "../types/applicants";

export default function PendingApplicantsPage() {
  const { data, isLoading, error, reload, updateData } = useAuthenticatedQuery(
    applicantsService.getPending,
  );

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const requestInProgress = useRef(false);

  async function handleApprove(applicant: PendingApplicant) {
    if (requestInProgress.current) return;

    setActionError(null);
    setSuccess(null);

    const { accessToken, user } = useAuthStore.getState();

    if (!accessToken || user?.role !== "RECEPCIONIST") return;

    const confirmed = window.confirm(
      `¿Aprobar a ${applicant.firstName} ${applicant.lastName}?\n\n` +
        `Correo: ${applicant.email}\n\n` +
        "Su cuenta quedará activa y podrá iniciar sesión.",
    );

    if (!confirmed) return;

    requestInProgress.current = true;
    setPendingId(applicant.id);

    try {
      const response = await applicantsService.approve(
        accessToken,
        applicant.id,
      );

      if (useAuthStore.getState().accessToken !== accessToken) {
        return;
      }

      updateData((current) => ({
        ...current,
        applicants: current.applicants.filter(
          (item) => item.id !== response.user.id,
        ),
      }));

      setSuccess(
        `${response.message}: ${response.user.firstName} ${response.user.lastName}`,
      );
    } catch (error: unknown) {
      if (useAuthStore.getState().accessToken !== accessToken) {
        return;
      }

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        useAuthStore.getState().logout();
        return;
      }

      const uncertainResult =
        axios.isAxiosError(error) &&
        (!error.response || error.response.status >= 500);

      setActionError(
        uncertainResult
          ? "No pudimos confirmar la aprobación. Actualiza la lista para comprobar si el postulante continúa pendiente antes de repetir la acción."
          : getApiErrorMessage(error),
      );
    } finally {
      requestInProgress.current = false;
      setPendingId(null);
    }
  }

  function handleReload() {
    setActionError(null);
    setSuccess(null);
    reload();
  }

  return (
    <section aria-labelledby="applicants-title">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            id="applicants-title"
            className="text-2xl font-bold text-brand sm:text-3xl"
          >
            Postulantes pendientes
          </h1>

          <p className="mt-2 text-ink/70">
            Revisa la matrícula antes de activar la cuenta del estudiante.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReload}
          disabled={isLoading || pendingId !== null}
          className="rounded-lg border border-brand px-4 py-2 font-medium text-brand hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
        >
          {isLoading ? "Cargando…" : "Actualizar"}
        </button>
      </div>

      {success && (
        <p
          role="status"
          className="mb-5 rounded-xl bg-success-soft p-5 text-success"
        >
          {success}
        </p>
      )}

      {actionError && (
        <p
          role="alert"
          className="mb-5 rounded-xl bg-danger-soft p-5 text-danger"
        >
          {actionError}
        </p>
      )}

      {isLoading && (
        <p role="status" className="rounded-xl bg-surface p-6">
          Consultando los postulantes…
        </p>
      )}

      {error && (
        <div role="alert" className="rounded-xl bg-danger-soft p-6 text-danger">
          <p>{error}</p>

          <button
            type="button"
            onClick={handleReload}
            className="mt-3 rounded-lg border border-current px-4 py-2"
          >
            Reintentar
          </button>
        </div>
      )}

      {data && data.applicants.length === 0 && (
        <p
          role="status"
          className="rounded-xl border border-border bg-surface p-6"
        >
          No hay postulantes pendientes de aprobación.
        </p>
      )}

      {data && (
        <div className="space-y-5">
          {data.applicants.map((applicant) => {
            const profile = applicant.stundentProfile;
            const obligations = profile?.financialObligations ?? [];

            const hasPaidEnrollment = obligations.some(
              (obligation) => obligation.status === "PAID",
            );

            return (
              <article
                key={applicant.id}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <h2 className="break-words text-xl font-semibold text-brand">
                  {applicant.firstName} {applicant.lastName}
                </h2>

                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm text-ink/70">Matrícula</dt>
                    <dd className="mt-1 break-words font-medium">
                      {profile?.enrollmentCode ?? "Sin perfil estudiantil"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-ink/70">Correo</dt>
                    <dd className="mt-1 break-words font-medium">
                      {applicant.email}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-ink/70">Teléfono</dt>
                    <dd className="mt-1 font-medium">
                      {applicant.phone || "No registrado"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 border-t border-border pt-4">
                  <h3 className="font-semibold text-brand">
                    Estado registrado de matrícula
                  </h3>

                  {obligations.length === 0 ? (
                    <p className="mt-2 text-sm text-warning">
                      No hay una obligación de matrícula registrada.
                    </p>
                  ) : (
                    <ul className="mt-3 space-y-2">
                      {obligations.map((obligation) => (
                        <li
                          key={obligation.id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-canvas p-3"
                        >
                          <span>
                            Importe: {formatAmount(obligation.amount)}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${obligationStyles[obligation.status]}`}
                          >
                            {obligationLabels[obligation.status]}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => void handleApprove(applicant)}
                    disabled={!hasPaidEnrollment || pendingId !== null}
                    className="rounded-lg bg-brand px-4 py-3 font-medium text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
                  >
                    {pendingId === applicant.id
                      ? "Aprobando…"
                      : "Aprobar postulante"}
                  </button>

                  {!hasPaidEnrollment && (
                    <p className="mt-2 text-sm text-ink/70">
                      La matrícula debe figurar como pagada antes de aprobar al
                      postulante.
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          to="/recepcion/obligaciones"
          className="font-medium text-brand underline underline-offset-4"
        >
          Consultar obligaciones
        </Link>

        <Link
          to="/recepcion/pagos"
          className="font-medium text-brand underline underline-offset-4"
        >
          Verificar pagos manuales
        </Link>
      </div>
    </section>
  );
}
