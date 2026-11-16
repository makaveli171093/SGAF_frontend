import { useState } from "react";
import RecordEditor, { type EditField } from "../ui/RecordEditor";
import { scheduleDayLabels } from "../../constants/scheduleLabels";
import type { AcademicGroup } from "../../types/groups";
import { useConfirmation } from "../../lib/confirmation";
import { useAuthenticatedMutation } from "../../hooks/useAuthenticatedMutation";
import { saveOperation } from "../../services/operations";
export default function ScheduleActions({
  group,
  block,
  onUpdated,
}: {
  group: AcademicGroup;
  block: AcademicGroup["scheduleBlocks"][number];
  onUpdated: () => void;
}) {
  const [editing, setEditing] = useState(false),
    confirm = useConfirmation(),
    mutation = useAuthenticatedMutation(saveOperation);
  const fields: EditField[] = [
    {
      name: "groupId",
      label: "Grupo",
      options: [{ id: group.id, label: group.name }],
    },
    {
      name: "dayOfWeek",
      label: "Día",
      options: Object.entries(scheduleDayLabels).map(([id, label]) => ({
        id,
        label,
      })),
    },
    { name: "startTime", label: "Inicio", type: "time" },
    { name: "endTime", label: "Fin", type: "time" },
  ];
  async function remove() {
    if (
      !(await confirm(
        `¿Eliminar el horario del ${scheduleDayLabels[block.dayOfWeek]} de ${group.name}? Se conserva el grupo y sus inscripciones.`,
      ))
    )
      return;
    if (
      await mutation.execute({
        path: `/management/schedules/${block.id}`,
        method: "delete",
        values: {},
      })
    )
      onUpdated();
  }
  if (group.academicPeriod.status === "CLOSED") return null;
  return (
    <div className="flex flex-wrap gap-2">
      <button className="btn-secondary" onClick={() => setEditing(true)}>
        Editar
      </button>
      <button
        className="btn-secondary"
        disabled={mutation.isPending}
        onClick={() => void remove()}
      >
        Eliminar
      </button>
      {mutation.error && (
        <p role="alert" className="text-danger">
          {mutation.error}
        </p>
      )}
      {editing && (
        <RecordEditor
          title="Editar horario"
          path={`/management/schedules/${block.id}`}
          fields={fields}
          initial={{
            groupId: group.id,
            dayOfWeek: block.dayOfWeek,
            startTime: block.startTime.slice(11, 16),
            endTime: block.endTime.slice(11, 16),
          }}
          onClose={() => setEditing(false)}
          onSaved={onUpdated}
          description="Horas de Bolivia. Se revisarán cruces del grupo, docente y estudiantes inscritos."
        />
      )}
    </div>
  );
}
