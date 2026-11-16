import { useState, type FormEvent } from "react";
import { useAuthenticatedMutation } from "../../hooks/useAuthenticatedMutation";
import { saveOperation } from "../../services/operations";
import { useAuthStore } from "../../stores/authStore";
import { useConfirmation } from "../../lib/confirmation";
export default function PasswordForm() {
  const [error, setError] = useState<string | null>(null),
    confirm = useConfirmation();
  const mutation = useAuthenticatedMutation(saveOperation);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget),
      currentPassword = String(form.get("currentPassword")),
      newPassword = String(form.get("newPassword"));
    if (newPassword !== form.get("repeatPassword")) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }
    if (new TextEncoder().encode(newPassword).length > 72) {
      setError("La contraseña supera 72 bytes. Usa una más corta.");
      return;
    }
    if (
      !(await confirm(
        "¿Cambiar la contraseña? Se cerrarán las sesiones anteriores y tendrás que iniciar sesión de nuevo.",
      ))
    )
      return;
    if (
      await mutation.execute({
        path: "/account/password",
        values: { currentPassword, newPassword },
      })
    )
      useAuthStore.getState().logout();
  }
  return (
    <form
      onSubmit={(event) => void submit(event)}
      className="rounded-2xl border border-border bg-surface p-6"
    >
      <h2 className="text-lg font-semibold text-brand">Cambiar contraseña</h2>
      <p className="mt-2 text-sm text-ink/70">
        Al guardarla se cerrarán tus sesiones en todos los dispositivos.
      </p>
      <fieldset
        disabled={mutation.isPending}
        className="mt-5 grid gap-4 sm:grid-cols-3"
      >
        <label className="text-sm font-medium">
          Contraseña actual
          <input
            className="form-field"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        <label className="text-sm font-medium">
          Nueva contraseña
          <input
            className="form-field"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={72}
          />
        </label>
        <label className="text-sm font-medium">
          Repite la nueva contraseña
          <input
            className="form-field"
            name="repeatPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={72}
          />
        </label>
      </fieldset>
      {(error || mutation.error) && (
        <p role="alert" className="mt-4 text-danger">
          {error ?? mutation.error}
        </p>
      )}
      <button className="btn-primary mt-5" disabled={mutation.isPending}>
        {mutation.isPending ? "Guardando…" : "Cambiar contraseña"}
      </button>
    </form>
  );
}
