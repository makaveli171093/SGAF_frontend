import axios from "axios";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getApiErrorMessage } from "../../lib/apiError";
import {
  academicPeriodSchema,
  periodDateToISO,
  type AcademicPeriodFormValues,
} from "../../schemas/academicPeriodSchema";
import { academicPeriodsService } from "../../services/academicPeriods";
import { useAuthStore } from "../../stores/authStore";

interface CreateAcademicPeriodFormProps {
  onCreated: () => void;
}

const fields: {
  name: keyof AcademicPeriodFormValues;
  label: string;
  type: "text" | "number" | "datetime-local";
}[] = [
  {
    name: "name",
    label: "Nombre del período",
    type: "text",
  },
  {
    name: "maxCredits",
    label: "Máximo de créditos por estudiante",
    type: "number",
  },
  {
    name: "startDate",
    label: "Inicio — fecha y hora de Bolivia",
    type: "datetime-local",
  },
  {
    name: "endDate",
    label: "Finalización — fecha y hora de Bolivia",
    type: "datetime-local",
  },
];

export default function CreateAcademicPeriodForm({
  onCreated,
}: CreateAcademicPeriodFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const requestInProgress = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AcademicPeriodFormValues>({
    resolver: zodResolver(academicPeriodSchema),
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      maxCredits: "",
    },
  });

  async function onSubmit(values: AcademicPeriodFormValues) {
    if (requestInProgress.current) return;

    setError(null);
    setSuccess(null);

    const { accessToken, user } = useAuthStore.getState();

    if (!accessToken || user?.role !== "ADMIN") return;

    const confirmed = window.confirm(
      `¿Crear el período "${values.name}"?\n\n` +
        `Máximo de créditos: ${values.maxCredits}\n` +
        "Se registrará con estado Planificado.",
    );

    if (!confirmed) return;

    requestInProgress.current = true;

    try {
      const response = await academicPeriodsService.create(accessToken, {
        name: values.name,
        startDate: periodDateToISO(values.startDate),
        endDate: periodDateToISO(values.endDate),
        maxCredits: Number(values.maxCredits),
      });

      if (useAuthStore.getState().accessToken !== accessToken) {
        return;
      }

      reset();
      setSuccess(`${response.message}: ${response.academicPeriod.name}`);
      onCreated();
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

      setError(
        uncertainResult
          ? "No pudimos confirmar la creación. Actualiza la lista antes de reenviar para evitar duplicados."
          : getApiErrorMessage(error),
      );
    } finally {
      requestInProgress.current = false;
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
          const fieldError = errors[field.name];
          const id = `period-${field.name}`;

          return (
            <div key={field.name} className="min-w-0">
              <label htmlFor={id} className="block text-sm font-medium">
                {field.label}
              </label>

              <input
                id={id}
                type={field.type}
                min={field.type === "number" ? 1 : undefined}
                step={field.type === "number" ? 1 : 60}
                {...register(field.name)}
                disabled={isSubmitting}
                aria-invalid={Boolean(fieldError)}
                aria-describedby={fieldError ? `${id}-error` : undefined}
                className="mt-2 min-w-0 w-full rounded-lg border border-border bg-surface p-3 focus:border-brand focus:outline-2 focus:outline-brand disabled:opacity-50"
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
        El período se creará como Planificado. Las inscripciones requieren un
        período activo y dentro de sus fechas.
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
        className="rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
      >
        {isSubmitting ? "Creando…" : "Crear período"}
      </button>
    </form>
  );
}
