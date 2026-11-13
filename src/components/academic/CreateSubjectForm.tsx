import axios from "axios";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getApiErrorMessage } from "../../lib/apiError";
import {
  subjectSchema,
  type SubjectFormValues,
} from "../../schemas/subjectSchema";
import { subjectsService } from "../../services/subjects";
import { useAuthStore } from "../../stores/authStore";

interface Props {
  onCreated: () => void;
}

const fields: {
  name: keyof SubjectFormValues;
  label: string;
  type: "text" | "number";
  min?: number;
  step?: number;
}[] = [
  { name: "code", label: "Código único", type: "text" },
  { name: "name", label: "Nombre de la materia", type: "text" },
  {
    name: "credits",
    label: "Créditos",
    type: "number",
    min: 1,
    step: 1,
  },
  {
    name: "enrollmentFee",
    label: "Tarifa de inscripción a la materia",
    type: "number",
    min: 0,
    step: 0.01,
  },
  {
    name: "monthlyFee",
    label: "Tarifa de mensualidad",
    type: "number",
    min: 0,
    step: 0.01,
  },
];

export default function CreateSubjectForm({ onCreated }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const locked = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      code: "",
      name: "",
      credits: "",
      enrollmentFee: "",
      monthlyFee: "",
    },
  });

  async function onSubmit(values: SubjectFormValues) {
    if (locked.current) return;

    setError(null);
    setSuccess(null);

    const { accessToken, user } = useAuthStore.getState();
    if (!accessToken || user?.role !== "ADMIN") return;

    const confirmed = window.confirm(
      `¿Crear la materia "${values.name}"?\n\n` +
        `Código: ${values.code}\n` +
        `Créditos: ${values.credits}\n` +
        `Inscripción: ${values.enrollmentFee}\n` +
        `Mensualidad: ${values.monthlyFee}`,
    );

    if (!confirmed) return;

    locked.current = true;

    try {
      const response = await subjectsService.create(accessToken, {
        code: values.code,
        name: values.name,
        credits: Number(values.credits),
        enrollmentFee: Number(values.enrollmentFee),
        monthlyFee: Number(values.monthlyFee),
      });

      if (useAuthStore.getState().accessToken !== accessToken) return;

      reset();
      setSuccess(`${response.message}: ${response.subject.name}`);
      onCreated();
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
          ? "No pudimos confirmar la creación. Actualiza la lista antes de reenviar."
          : getApiErrorMessage(error),
      );
    } finally {
      locked.current = false;
    }
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
      aria-busy={isSubmitting}
      className="mt-5 space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const id = `subject-${field.name}`;
          const fieldError = errors[field.name];

          return (
            <div key={field.name} className="min-w-0">
              <label htmlFor={id} className="block text-sm font-medium">
                {field.label}
              </label>

              <input
                id={id}
                type={field.type}
                min={field.min}
                step={field.step}
                {...register(field.name)}
                disabled={isSubmitting}
                aria-invalid={Boolean(fieldError)}
                aria-describedby={fieldError ? `${id}-error` : undefined}
                className="mt-2 w-full rounded-lg border border-border bg-surface p-3 focus:border-brand focus:outline-2 focus:outline-brand disabled:opacity-50"
              />

              {fieldError && (
                <p
                  id={`${id}-error`}
                  role="alert"
                  className="mt-1 text-sm text-danger"
                >
                  {fieldError.message}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-sm text-ink/70">
        Estas tarifas se utilizan al inscribir estudiantes en los grupos de esta
        materia. La matrícula inicial del postulante es un concepto
        independiente.
      </p>

      {error && (
        <p role="alert" className="rounded-lg bg-danger-soft p-4 text-danger">
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="rounded-lg bg-success-soft p-4 text-success"
        >
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-hover disabled:opacity-50"
      >
        {isSubmitting ? "Creando…" : "Crear materia"}
      </button>
    </form>
  );
}
