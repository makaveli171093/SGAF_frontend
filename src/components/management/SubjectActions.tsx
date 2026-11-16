import { useState } from "react";
import RecordEditor, { type EditField } from "../ui/RecordEditor";
import type { Subject } from "../../types/subjects";
const fields: EditField[] = [
  { name: "code", label: "Código", maxLength: 50 },
  { name: "name", label: "Nombre", maxLength: 150 },
  { name: "credits", label: "Créditos", type: "number", min: 1, step: "1" },
  {
    name: "enrollmentFee",
    label: "Inscripción (Bs)",
    type: "number",
    min: 0,
    max: 99999999.99,
    step: "0.01",
  },
  {
    name: "monthlyFee",
    label: "Mensualidad (Bs)",
    type: "number",
    min: 0,
    max: 99999999.99,
    step: "0.01",
  },
  { name: "active", label: "Materia activa", type: "checkbox" },
];
export default function SubjectActions({
  subject,
  onUpdated,
}: {
  subject: Subject;
  onUpdated: () => void;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <div className="mt-5">
      <button className="btn-secondary" onClick={() => setEditing(true)}>
        Editar materia
      </button>
      {editing && (
        <RecordEditor
          title="Editar materia"
          path={`/management/subjects/${subject.id}`}
          fields={fields}
          initial={{ ...subject }}
          onClose={() => setEditing(false)}
          onSaved={onUpdated}
          description="Las tarifas aplican a futuras inscripciones. Los créditos se pueden cambiar mientras no existan inscripciones; después forman parte del historial."
        />
      )}
    </div>
  );
}
