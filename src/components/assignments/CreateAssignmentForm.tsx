import axios from "axios";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getApiErrorMessage } from "../../lib/apiError";
import {
  assignmentDateToISO,
  assignmentSchema,
  type AssignmentFormValues,
} from "../../schemas/assignmentSchema";
import { assignmentsService } from "../../services/assignments";
import { useAuthStore } from "../../stores/authStore";

interface CreateAssignmentFormProps {
  groupId: string;
  groupName: string;
  onCreated: () => void;
}

export default function CreateAssignmentForm({
  groupId,
  groupName,
  onCreated,
}: CreateAssignmentFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const requestInProgress = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: "",
      instructions: "",
      dueDate: "",
    },
  });

  async function onSubmit(values: AssignmentFormValues) {
    if (requestInProgress.current) return;

    setServerError(null);
    setSuccess(null);

    const { accessToken, user } = useAuthStore.getState();

    if (!accessToken || user?.role !== "TEACHER") return;

    if (user.status !== "ACTIVE") {
      setServerError("Tu cuenta no está habilitada para publicar tareas.");
      return;
    }

    const confirmed = window.confirm(
      `¿Publicar "${values.title}" en ${groupName}?`,
    );

    if (!confirmed) return;

    requestInProgress.current = true;

    try {
      const response = await assignmentsService.create(accessToken, {
        groupId,
        title: values.title,
        instructions: values.instructions,
        dueDate: assignmentDateToISO(values.dueDate),
      });

      if (useAuthStore.getState().accessToken !== accessToken) {
        return;
      }

      reset();
      setSuccess(`${response.message}: ${response.assignment.tittle}`);
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

      setServerError(
        uncertainResult
          ? "No pudimos confirmar la publicación. Comprueba las tareas registradas antes de reenviar para evitar duplicados."
          : getApiErrorMessage(error),
      );
    } finally {
      requestInProgress.current = false;
    }
  }

  const titleId = `assignment-title-${groupId}`;
  const instructionsId = `assignment-instructions-${groupId}`;
  const dateId = `assignment-date-${groupId}`;

  const fieldClass =
    "mt-2 w-full rounded-lg border border-border bg-surface p-3 focus:border-brand focus:outline-2 focus:outline-brand disabled:opacity-50";

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      aria-busy={isSubmitting}
      className="mt-4 space-y-4"
    >
      <div>
        <label htmlFor={titleId} className="block text-sm font-medium">
          Título
        </label>

        <input
          id={titleId}
          {...register("title")}
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? `${titleId}-error` : undefined}
          className={fieldClass}
        />

        {errors.title && (
          <p
            id={`${titleId}-error`}
            role="alert"
            className="mt-1 text-sm text-danger"
          >
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={instructionsId} className="block text-sm font-medium">
          Instrucciones
        </label>

        <textarea
          id={instructionsId}
          rows={5}
          {...register("instructions")}
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.instructions)}
          aria-describedby={
            errors.instructions ? `${instructionsId}-error` : undefined
          }
          className={fieldClass}
        />

        {errors.instructions && (
          <p
            id={`${instructionsId}-error`}
            role="alert"
            className="mt-1 text-sm text-danger"
          >
            {errors.instructions.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={dateId} className="block text-sm font-medium">
          Fecha y hora límite — Bolivia
        </label>

        <input
          id={dateId}
          type="datetime-local"
          step={60}
          {...register("dueDate")}
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.dueDate)}
          aria-describedby={errors.dueDate ? `${dateId}-error` : undefined}
          className={`${fieldClass} min-w-0`}
        />

        {errors.dueDate && (
          <p
            id={`${dateId}-error`}
            role="alert"
            className="mt-1 text-sm text-danger"
          >
            {errors.dueDate.message}
          </p>
        )}
      </div>

      {serverError && (
        <p role="alert" className="rounded-lg bg-danger-soft p-4 text-danger">
          {serverError}
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
        className="rounded-lg bg-brand px-4 py-3 font-medium text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
      >
        {isSubmitting ? "Publicando…" : "Publicar tarea"}
      </button>
    </form>
  );
}
