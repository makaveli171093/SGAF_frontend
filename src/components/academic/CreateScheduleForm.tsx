import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthenticatedMutation } from "../../hooks/useAuthenticatedMutation";
import {
  scheduleSchema,
  type ScheduleFormValues,
} from "../../schemas/groupSetupSchema";
import { groupSetupService } from "../../services/groupSetup";
import { scheduleDayLabels } from "../../constants/scheduleLabels";

interface Props {
  groupId: string;
  groupName: string;
  onCreated: () => void;
}

export default function CreateScheduleForm({
  groupId,
  groupName,
  onCreated,
}: Props) {
  const { execute, isPending, error } = useAuthenticatedMutation(
    groupSetupService.createSchedule,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      dayOfWeek: "MONDAY",
      startTime: "",
      endTime: "",
    },
  });

  async function onSubmit(values: ScheduleFormValues) {
    const confirmed = window.confirm(
      `¿Agregar este horario a ${groupName}?\n\n` +
        `${scheduleDayLabels[values.dayOfWeek]}: ` +
        `${values.startTime} a ${values.endTime}`,
    );

    if (!confirmed) return;

    const created = await execute({ groupId, ...values });

    if (created) {
      reset();
      onCreated();
    }
  }

  const fieldClass =
    "mt-2 min-w-0 w-full rounded-lg border border-border bg-surface p-3 focus:border-brand focus:outline-2 focus:outline-brand";

  return (
    <form
      noValidate
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
      aria-busy={isPending}
      className="mt-4 space-y-4"
    >
      <fieldset disabled={isPending} className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor={`day-${groupId}`} className="text-sm font-medium">
            Día
          </label>

          <select
            id={`day-${groupId}`}
            {...register("dayOfWeek")}
            className={fieldClass}
          >
            {Object.entries(scheduleDayLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          {errors.dayOfWeek && (
            <p role="alert" className="mt-1 text-sm text-danger">
              {errors.dayOfWeek.message}
            </p>
          )}
        </div>

        {(
          [
            { name: "startTime", label: "Hora de inicio" },
            { name: "endTime", label: "Hora final" },
          ] as const
        ).map((field) => {
          const id = `${field.name}-${groupId}`;

          return (
            <div key={field.name}>
              <label htmlFor={id} className="text-sm font-medium">
                {field.label}
              </label>

              <input
                id={id}
                type="time"
                step={60}
                {...register(field.name)}
                aria-invalid={Boolean(errors[field.name])}
                aria-describedby={
                  errors[field.name] ? `${id}-error` : undefined
                }
                className={fieldClass}
              />

              {errors[field.name] && (
                <p
                  id={`${id}-error`}
                  role="alert"
                  className="mt-1 text-sm text-danger"
                >
                  {errors[field.name]?.message}
                </p>
              )}
            </div>
          );
        })}
      </fieldset>

      <p className="text-sm text-ink/70">
        Registra las horas de clase de Bolivia. Cada bloque debe comenzar y
        terminar el mismo día.
      </p>

      {error && (
        <p role="alert" className="rounded-lg bg-danger-soft p-4 text-danger">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-hover disabled:opacity-50"
      >
        {isPending ? "Guardando…" : "Agregar horario"}
      </button>
    </form>
  );
}
