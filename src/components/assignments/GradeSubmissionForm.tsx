import axios from "axios";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getApiErrorMessage } from "../../lib/apiError";
import {
  gradeSubmissionSchema,
  type GradeSubmissionFormValues,
} from "../../schemas/gradeSubmissionSchema";
import { submissionsService } from "../../services/submissions";
import { useAuthStore } from "../../stores/authStore";
import type { StudentSubmission } from "../../types/assignments";

interface GradeSubmissionFormProps {
  submission: StudentSubmission;
  onGraded: (submission: StudentSubmission) => void;
}

export default function GradeSubmissionForm({
  submission,
  onGraded,
}: GradeSubmissionFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const requestInProgress = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GradeSubmissionFormValues>({
    resolver: zodResolver(gradeSubmissionSchema),
    defaultValues: {
      grade: submission.grade === null ? "" : String(submission.grade),
      feedback: submission.feedback ?? "",
    },
  });

  async function onSubmit(values: GradeSubmissionFormValues) {
    if (requestInProgress.current) return;

    setServerError(null);
    setSuccess(null);

    const { accessToken, user } = useAuthStore.getState();

    if (!accessToken || user?.role !== "TEACHER") return;

    if (user.status !== "ACTIVE") {
      setServerError("Tu cuenta no está habilitada para calificar.");
      return;
    }

    const confirmed = window.confirm(
      `¿Guardar la calificación ${Number(values.grade)} / 100?${
        submission.grade !== null
          ? " Se actualizará la calificación anterior."
          : ""
      }`,
    );

    if (!confirmed) return;

    requestInProgress.current = true;

    try {
      const response = await submissionsService.grade(
        accessToken,
        submission.id,
        {
          grade: Number(values.grade),
          feedback: values.feedback,
        },
      );

      if (useAuthStore.getState().accessToken !== accessToken) {
        return;
      }

      onGraded(response.submission);

      reset({
        grade:
          response.submission.grade === null
            ? ""
            : String(response.submission.grade),
        feedback: response.submission.feedback ?? "",
      });

      setSuccess(response.message);
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
          ? "No pudimos confirmar el resultado. Conserva tus comentarios y pulsa Actualizar para revisar la calificación guardada antes de reenviar."
          : getApiErrorMessage(error),
      );
    } finally {
      requestInProgress.current = false;
    }
  }

  const gradeId = `grade-${submission.id}`;
  const feedbackId = `feedback-${submission.id}`;

  return (
    <form
      noValidate
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
      aria-busy={isSubmitting}
      className="mt-4 space-y-4"
    >
      <div>
        <label htmlFor={gradeId} className="block text-sm font-medium">
          Calificación — de 1 a 100
        </label>

        <input
          id={gradeId}
          type="number"
          min={1}
          max={100}
          step="any"
          {...register("grade")}
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.grade)}
          aria-describedby={errors.grade ? `${gradeId}-error` : undefined}
          className="mt-2 w-full rounded-lg border border-border bg-surface p-3 focus:border-brand focus:outline-2 focus:outline-brand disabled:opacity-50"
        />

        {errors.grade && (
          <p
            id={`${gradeId}-error`}
            role="alert"
            className="mt-1 text-sm text-danger"
          >
            {errors.grade.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={feedbackId} className="block text-sm font-medium">
          Comentarios para el estudiante — opcional
        </label>

        <textarea
          id={feedbackId}
          rows={4}
          {...register("feedback")}
          disabled={isSubmitting}
          className="mt-2 w-full rounded-lg border border-border bg-surface p-3 focus:border-brand focus:outline-2 focus:outline-brand disabled:opacity-50"
        />
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
        {isSubmitting ? "Guardando…" : "Guardar calificación"}
      </button>
    </form>
  );
}
