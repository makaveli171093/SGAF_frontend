import { useState } from "react";
import RecordEditor, { type EditField } from "../ui/RecordEditor";
import { useConfirmation } from "../../lib/confirmation";
import { useAuthenticatedMutation } from "../../hooks/useAuthenticatedMutation";
import { saveOperation } from "../../services/operations";
import { useAuthStore } from "../../stores/authStore";
import type { SystemUser } from "../../types/users";
const fields: EditField[] = [
  { name: "firstName", label: "Nombres", maxLength: 100 },
  { name: "lastName", label: "Apellidos", maxLength: 100 },
  { name: "email", label: "Correo", type: "email" },
  {
    name: "phone",
    label: "Teléfono",
    type: "tel",
    required: false,
    maxLength: 30,
  },
  { name: "ci", label: "Documento", minLength: 5, maxLength: 20 },
];
export default function UserActions({
  user,
  onUpdated,
}: {
  user: SystemUser;
  onUpdated: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const me = useAuthStore((state) => state.user),
    confirm = useConfirmation(),
    mutation = useAuthenticatedMutation(saveOperation);
  async function changeStatus() {
    const status = user.status === "INACTIVE" ? "ACTIVE" : "INACTIVE";
    if (
      !(await confirm(
        `${status === "ACTIVE" ? "Reactivar" : "Inactivar"} a ${user.firstName} ${user.lastName}? Se conservará su historial y se revocarán sus sesiones anteriores.`,
      ))
    )
      return;
    if (
      await mutation.execute({
        path: `/management/users/${user.id}/status`,
        values: { status },
      })
    )
      onUpdated();
  }
  const editFields: EditField[] =
    user.role === "TEACHER"
      ? [
          ...fields,
          { name: "specialty", label: "Especialidad", maxLength: 150 },
          { name: "hireDate", label: "Fecha de contratación", type: "date" },
        ]
      : fields;
  return (
    <div className="record-actions mt-5 border-t border-border pt-4">
      <div className="flex flex-wrap gap-3">
        <button className="btn-secondary" onClick={() => setEditing(true)}>
          Editar datos
        </button>
        {user.id !== me?.id && user.status !== "PENDING_APPROVAL" && (
          <button
            className="btn-secondary"
            disabled={mutation.isPending}
            onClick={() => void changeStatus()}
          >
            {user.status === "INACTIVE" ? "Reactivar" : "Inactivar"}
          </button>
        )}
      </div>
      {mutation.error && (
        <p role="alert" className="mt-3 text-danger">
          {mutation.error}
        </p>
      )}
      {editing && (
        <RecordEditor
          title={`Editar a ${user.firstName}`}
          path={`/management/users/${user.id}`}
          fields={editFields}
          initial={{
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone ?? "",
            ci: user.ci,
            specialty: user.teacherProfile?.specialty ?? "",
            hireDate: user.teacherProfile?.hireDate.slice(0, 10) ?? "",
          }}
          onClose={() => setEditing(false)}
          onSaved={onUpdated}
          description="El rol se conserva. La inactivación mantiene sus registros académicos y financieros."
        />
      )}
    </div>
  );
}
