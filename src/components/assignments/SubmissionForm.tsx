import axios from "axios";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getApiErrorMessage } from "../../lib/apiError";
import {
  submissionSchema,
  type SubmissionFormValues,
} from "../../schemas/submissionSchema";
import { submissionsService } from "../../services/submissions";
import { useAuthStore } from "../../stores/authStore";
import type { StudentSubmission } from "../../types/assignments";

interface SubmissionFormProps {
  assignmentId: string;
  dueDate: string;
  onSubmitted: (submission: StudentSubmission) => void;
}

export default function SubmissionForm({
  assignmentId,
  dueDate,
  onSubmitted,
}: SubmissionFormProps) {
  const user = useAuthStore((state) => state.user);
  const [serverError, setServerError] = useState<string | null>(null);
  const requestInProgress = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      textContent: "",
      fileUrl: "",
    },
  });

  async function onSubmit(values: SubmissionFormValues) {
    if (requestInProgress.current) return;

    setServerError(null);

    const { accessToken, user: currentUser } = useAuthStore.getState();

    if (!accessToken || currentUser?.role !== "STUDENT") return;

    if (currentUser.status !== "ACTIVE") {
      setServerError("Tu cuenta no está habilitada para entregar tareas.");
      return;
    }

    if (new Date(dueDate).getTime() < Date.now()) {
      setServerError("La fecha límite de la tarea ya venció.");
      return;
    }

    const confirmed = window.confirm(
      "¿Confirmas el envío? Solo se permite una entrega por tarea y no podrás editarla desde esta aplicación.",
    );

    if (!confirmed) return;

    requestInProgress.current = true;

    try {
      const response = await submissionsService.create(accessToken, {
        assignmentId,
        textContent: values.textContent || undefined,
        fileUrl: values.fileUrl || undefined,
      });

      if (useAuthStore.getState().accessToken !== accessToken) {
        return;
      }

      onSubmitted(response.submission);
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
          ? "No pudimos confirmar el resultado. Conserva una copia de tu respuesta y pulsa Actualizar para comprobar si la entrega quedó registrada antes de reenviar."
          : getApiErrorMessage(error),
      );
    } finally {
      requestInProgress.current = false;
    }
  }

  if (user?.status !== "ACTIVE") {
    return (
      <p
        role="status"
        className="mt-5 rounded-lg bg-warning-soft p-4 text-warning"
      >
        {user?.status === "SUSPEND_FOR_DEBT"
          ? "Debes regularizar tus obligaciones vencidas para entregar esta tarea."
          : "Tu cuenta no está habilitada para entregar tareas."}
      </p>
    );
  }

  const textId = `submission-text-${assignmentId}`;
  const linkId = `submission-link-${assignmentId}`;

  return (
    <form
      noValidate
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
      aria-busy={isSubmitting}
      className="mt-6 space-y-4 border-t border-border pt-5"
    >
      <h3 className="font-semibold text-brand">Preparar entrega</h3>

      <div>
        <label htmlFor={textId} className="block text-sm font-medium">
          Respuesta
        </label>

        <textarea
          id={textId}
          rows={5}
          {...register("textContent")}
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.textContent)}
          aria-describedby={errors.textContent ? `${textId}-error` : undefined}
          className="mt-2 w-full rounded-lg border border-border bg-surface p-3 focus:border-brand focus:outline-2 focus:outline-brand disabled:opacity-50"
        />

        {errors.textContent && (
          <p
            id={`${textId}-error`}
            role="alert"
            className="mt-1 text-sm text-danger"
          >
            {errors.textContent.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={linkId} className="block text-sm font-medium">
          Enlace al documento
        </label>

        <input
          id={linkId}
          type="url"
          {...register("fileUrl")}
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.fileUrl)}
          aria-describedby={`${linkId}-help ${
            errors.fileUrl ? `${linkId}-error` : ""
          }`}
          className="mt-2 w-full rounded-lg border border-border bg-surface p-3 focus:border-brand focus:outline-2 focus:outline-brand disabled:opacity-50"
        />

        <p id={`${linkId}-help`} className="mt-1 text-sm text-ink/70">
          Puedes enviar texto, un enlace o ambos. Si compartes un documento,
          asegúrate de que el docente pueda abrirlo.
        </p>

        {errors.fileUrl && (
          <p
            id={`${linkId}-error`}
            role="alert"
            className="mt-1 text-sm text-danger"
          >
            {errors.fileUrl.message}
          </p>
        )}
      </div>

      {serverError && (
        <p role="alert" className="rounded-lg bg-danger-soft p-4 text-danger">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-brand px-4 py-3 font-medium text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
      >
        {isSubmitting ? "Enviando…" : "Entregar tarea"}
      </button>
    </form>
  );
}
