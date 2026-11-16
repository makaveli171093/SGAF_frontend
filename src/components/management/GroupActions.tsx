import { useState } from "react";
import RecordEditor, { type EditField } from "../ui/RecordEditor";
import type { AcademicGroup } from "../../types/groups";
import type { GroupOptions } from "../../services/groupSetup";
export default function GroupActions({
  group,
  options,
  onUpdated,
}: {
  group: AcademicGroup;
  options: GroupOptions;
  onUpdated: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const subjects = options.subjects.some((s) => s.id === group.subjectId)
    ? options.subjects
    : [
        ...options.subjects,
        { id: group.subjectId, label: `${group.subject.name} (actual)` },
      ];
  const fields: EditField[] = [
    { name: "name", label: "Nombre" },
    {
      name: "maxCapacity",
      label: "Capacidad",
      type: "number",
      min: Math.max(1, group._count.enrollments),
      step: "1",
    },
    { name: "subjectId", label: "Materia", options: subjects },
    { name: "academicPeriodId", label: "Periodo", options: options.periods },
    { name: "teacherId", label: "Docente", options: options.teachers },
  ];
  if (group.academicPeriod.status === "CLOSED") return null;
  return (
    <div className="mt-4">
      <button className="btn-secondary" onClick={() => setEditing(true)}>
        Editar grupo
      </button>
      {editing && (
        <RecordEditor
          title="Editar grupo"
          path={`/management/groups/${group.id}`}
          fields={fields}
          initial={{
            name: group.name,
            maxCapacity: group.maxCapacity,
            subjectId: group.subjectId,
            academicPeriodId: group.academicPeriodId,
            teacherId: group.teacherId,
          }}
          onClose={() => setEditing(false)}
          onSaved={onUpdated}
          description="La capacidad debe cubrir a los inscritos activos. Si existen inscripciones o tareas, se conserva la materia y el periodo. Se revisarán cruces de horario."
        />
      )}
    </div>
  );
}
