import { useState } from "react";
import { useAuthenticatedMutation } from "../../hooks/useAuthenticatedMutation";
import { academicPeriodsService } from "../../services/academicPeriods";
import { useConfirmation } from "../../lib/confirmation";
import RecordEditor from "../ui/RecordEditor";
import PeriodHistory from "../management/PeriodHistory";
import type { AcademicPeriod } from "../../types/academicPeriods";
export default function PeriodStatusActions({
  period,
  onUpdated,
}: {
  period: AcademicPeriod;
  onUpdated: () => void;
}) {
  const [reopen, setReopen] = useState(false),
    [history, setHistory] = useState(false),
    confirm = useConfirmation();
  const mutation = useAuthenticatedMutation(
    (token: string, status: "ACTIVE" | "CLOSED") =>
      academicPeriodsService.updateStatus(token, period.id, status),
  );
  async function update(status: "ACTIVE" | "CLOSED") {
    if (
      !(await confirm(
        status === "ACTIVE"
          ? `¿Activar ${period.name}? Debe estar dentro de sus fechas de vigencia.`
          : `¿Cerrar ${period.name}? Se detendrán las nuevas inscripciones. Solo un administrador podrá reabrirlo con un motivo y dentro de las fechas permitidas.`,
      ))
    )
      return;
    if (await mutation.execute(status)) onUpdated();
  }
  return (
    <div className="mt-5 border-t border-border pt-4">
      <div className="flex flex-wrap gap-3">
        {period.status === "CLOSED" ? (
          <button className="btn-secondary" onClick={() => setReopen(true)}>
            Reabrir periodo
          </button>
        ) : (
          <>
            {period.status === "PLANNED" && (
              <button
                disabled={mutation.isPending}
                className="btn-primary"
                onClick={() => void update("ACTIVE")}
              >
                Activar periodo
              </button>
            )}
            <button
              disabled={mutation.isPending}
              className="btn-secondary"
              onClick={() => void update("CLOSED")}
            >
              Cerrar periodo
            </button>
          </>
        )}
        <button
          className="btn-secondary"
          aria-expanded={history}
          onClick={() => setHistory(!history)}
        >
          Historial de reaperturas
        </button>
      </div>
      {mutation.error && (
        <p role="alert" className="mt-3 text-danger">
          {mutation.error}
        </p>
      )}
      {history && <PeriodHistory id={period.id} />}
      {reopen && (
        <RecordEditor
          title={`Reabrir ${period.name}`}
          path={`/management/periods/${period.id}/reopen`}
          fields={[
            {
              name: "reason",
              label: "Motivo de reapertura",
              type: "textarea",
              minLength: 10,
              maxLength: 500,
            },
          ]}
          initial={{ reason: "" }}
          description="Se registran administrador, fecha y motivo. Si aún no inicia, volverá a Planificado; si está vigente, a Activo. Un periodo vencido no se puede reabrir."
          onClose={() => setReopen(false)}
          onSaved={onUpdated}
        />
      )}
    </div>
  );
}
