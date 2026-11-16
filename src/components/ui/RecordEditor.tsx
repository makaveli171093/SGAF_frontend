import { useEffect, useId, useState, type FormEvent } from "react";
import { useAuthenticatedMutation } from "../../hooks/useAuthenticatedMutation";
import { saveOperation, type EditValues } from "../../services/operations";
import { useAuthStore } from "../../stores/authStore";
import Modal from "./Modal";

export interface EditField {
  name: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "tel"
    | "number"
    | "date"
    | "time"
    | "password"
    | "checkbox"
    | "textarea";
  required?: boolean;
  min?: number;
  max?: number;
  step?: string;
  minLength?: number;
  maxLength?: number;
  options?: { id: string; label: string }[];
  help?: string;
}
interface Props {
  title: string;
  path: string;
  fields: EditField[];
  initial: EditValues;
  onSaved: () => void;
  onClose: () => void;
  description?: string;
}
export default function RecordEditor({
  title,
  path,
  fields,
  initial,
  onSaved,
  onClose,
  description,
}: Props) {
  const id = useId();
  const [dirty, setDirty] = useState(false);
  const [discard, setDiscard] = useState(false);
  const mutation = useAuthenticatedMutation(
    async (token: string, values: EditValues) => {
      const response = await saveOperation(token, { path, values });
      if (response.user && useAuthStore.getState().accessToken === token)
        useAuthStore.getState().setSession(token, response.user);
      return response;
    },
  );
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function close() {
    if (dirty) setDiscard(true);
    else onClose();
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget),
      values: EditValues = {};
    for (const field of fields) {
      const raw = String(form.get(field.name) ?? "");
      values[field.name] =
        field.type === "checkbox"
          ? form.has(field.name)
          : field.type === "number"
            ? Number(raw)
            : field.type === "password"
              ? raw
              : raw.trim();
    }
    if (await mutation.execute(values)) {
      setDirty(false);
      onSaved();
      onClose();
    }
  }
  return (
    <Modal title={title} onClose={close} busy={mutation.isPending}>
      {discard ? (
        <div>
          <p>Tienes cambios sin guardar. ¿Quieres descartarlos?</p>
          <div className="mt-5 flex gap-3">
            <button className="btn-secondary" onClick={() => setDiscard(false)}>
              Seguir editando
            </button>
            <button className="btn-primary" onClick={onClose}>
              Descartar cambios
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(event) => void submit(event)}
          onChange={() => setDirty(true)}
          aria-busy={mutation.isPending}
        >
          {description && (
            <p className="mb-5 text-sm leading-relaxed text-ink/70">
              {description}
            </p>
          )}
          <fieldset
            disabled={mutation.isPending}
            className="grid gap-4 sm:grid-cols-2"
          >
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.type === "textarea" ? "sm:col-span-2" : ""}
              >
                <label
                  className="block text-sm font-medium"
                  htmlFor={`${id}-${field.name}`}
                >
                  {field.label}
                  {field.required !== false && field.type !== "checkbox"
                    ? " *"
                    : ""}
                </label>
                {field.options ? (
                  <select
                    id={`${id}-${field.name}`}
                    name={field.name}
                    defaultValue={String(initial[field.name] ?? "")}
                    required={field.required !== false}
                    className="form-field"
                  >
                    <option value="">Selecciona…</option>
                    {field.options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    id={`${id}-${field.name}`}
                    name={field.name}
                    defaultValue={String(initial[field.name] ?? "")}
                    required={field.required !== false}
                    minLength={field.minLength}
                    maxLength={field.maxLength}
                    rows={4}
                    className="form-field"
                  />
                ) : field.type === "checkbox" ? (
                  <input
                    id={`${id}-${field.name}`}
                    name={field.name}
                    type="checkbox"
                    defaultChecked={Boolean(initial[field.name])}
                    className="mt-3 h-5 w-5 accent-brand"
                  />
                ) : (
                  <input
                    id={`${id}-${field.name}`}
                    name={field.name}
                    type={field.type ?? "text"}
                    defaultValue={String(initial[field.name] ?? "")}
                    required={field.required !== false}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    minLength={field.minLength}
                    maxLength={field.maxLength}
                    autoComplete={
                      field.type === "password" ? "new-password" : undefined
                    }
                    className="form-field"
                  />
                )}
                {field.help && (
                  <p className="mt-1 text-xs text-ink/70">{field.help}</p>
                )}
              </div>
            ))}
          </fieldset>
          {mutation.error && (
            <p
              role="alert"
              className="mt-4 rounded-lg bg-danger-soft p-4 text-danger"
            >
              {mutation.error}
            </p>
          )}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              disabled={mutation.isPending}
              onClick={close}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button disabled={mutation.isPending} className="btn-primary">
              {mutation.isPending ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
