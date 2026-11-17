import { useState } from "react";
import { roleLabels, statusLabels } from "../constants/authLabels";
import { useAuthStore } from "../stores/authStore";
import RecordEditor from "../components/ui/RecordEditor";
import PhotoEditor from "../components/account/PhotoEditor";
import PasswordForm from "../components/account/PasswordForm";
export default function AccountPage() {
  const user = useAuthStore((state) => state.user),
    [editing, setEditing] = useState(false),
    [saved, setSaved] = useState(false);
  if (!user) return null;
  return (
    <section className="account-page">
      <div className="account-heading">
        <h1 className="text-3xl font-bold text-brand">Mi cuenta</h1>
        <p className="mt-2 text-ink/70">
          Tu información personal y seguridad de acceso.
        </p>
      </div>
      <article className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-brand">
            Información personal
          </h2>
          <button className="btn-secondary" onClick={() => setEditing(true)}>
            Editar mis datos
          </button>
        </div>
        <dl className="mt-5 grid gap-5 sm:grid-cols-2">
          {[
            ["Nombre", `${user.firstName} ${user.lastName}`],
            ["Correo", user.email],
            ["Teléfono", user.phone || "No registrado"],
            ["Rol", roleLabels[user.role]],
            ["Estado", statusLabels[user.status]],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-sm text-ink/70">{label}</dt>
              <dd className="mt-1 wrap-break-word font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        {saved && (
          <p role="status" className="mt-4 text-success">
            Datos personales actualizados.
          </p>
        )}
      </article>
      {user.status === "SUSPEND_FOR_DEBT" && (
        <p
          role="status"
          className="rounded-xl bg-warning-soft p-5 text-warning"
        >
          Tienes obligaciones vencidas. Regulariza tus pagos para nuevas
          inscripciones y entregas.
        </p>
      )}
      <PhotoEditor />
      <PasswordForm />
      {editing && (
        <RecordEditor
          title="Editar mis datos"
          path="/account/profile"
          fields={[
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
          ]}
          initial={{
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone ?? "",
          }}
          onClose={() => setEditing(false)}
          onSaved={() => setSaved(true)}
          description="Si cambias el correo, úsalo en tu próximo inicio de sesión. Tu rol y estado solo se administran mediante los procesos autorizados."
        />
      )}
    </section>
  );
}
