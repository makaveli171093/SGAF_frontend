import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthenticatedMutation } from "../../hooks/useAuthenticatedMutation";
import {
  groupSchema,
  type GroupFormValues,
} from "../../schemas/groupSetupSchema";
import {
  groupSetupService,
  type GroupOptions,
} from "../../services/groupSetup";

interface Props {
  options: GroupOptions;
  onCreated: () => void;
}

export default function CreateGroupForm({ options, onCreated }: Props) {
  const { execute, isPending, error, success } = useAuthenticatedMutation(
    groupSetupService.createGroup,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      maxCapacity: "",
      subjectId: "",
      academicPeriodId: "",
      teacherId: "",
    },
  });

  const selectors = [
    {
      name: "subjectId" as const,
      label: "Materia",
      options: options.subjects,
    },
    {
      name: "academicPeriodId" as const,
      label: "Período académico",
      options: options.periods,
    },
    {
      name: "teacherId" as const,
      label: "Docente",
      options: options.teachers,
    },
  ];

  const missingOptions = selectors.some(
    (selector) => selector.options.length === 0,
  );

  async function onSubmit(values: GroupFormValues) {
    if (!window.confirm(`¿Crear el grupo "${values.name}"?`)) return;

    const created = await execute({
      ...values,
      maxCapacity: Number(values.maxCapacity),
    });

    if (created) {
      reset();
      onCreated();
    }
  }

  const fieldClass =
    "mt-2 w-full rounded-lg border border-border bg-surface p-3 focus:border-brand focus:outline-2 focus:outline-brand disabled:opacity-50";

  return (
    <form
      noValidate
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
      aria-busy={isPending}
      className="mt-5 space-y-5"
    >
      <fieldset disabled={isPending} className="grid gap-5 sm:grid-cols-2">
        {(
          [
            { name: "name", label: "Nombre del grupo", type: "text" },
            { name: "maxCapacity", label: "Capacidad máxima", type: "number" },
          ] as const
        ).map((field) => (
          <div key={field.name}>
            <label
              htmlFor={`group-${field.name}`}
              className="text-sm font-medium"
            >
              {field.label}
            </label>

            <input
              id={`group-${field.name}`}
              type={field.type}
              min={field.type === "number" ? 1 : undefined}
              step={field.type === "number" ? 1 : undefined}
              {...register(field.name)}
              aria-invalid={Boolean(errors[field.name])}
              aria-describedby={
                errors[field.name] ? `group-${field.name}-error` : undefined
              }
              className={fieldClass}
            />

            {errors[field.name] && (
              <p
                id={`group-${field.name}-error`}
                role="alert"
                className="mt-1 text-sm text-danger"
              >
                {errors[field.name]?.message}
              </p>
            )}
          </div>
        ))}

        {selectors.map((selector) => (
          <div key={selector.name} className="min-w-0">
            <label
              htmlFor={`group-${selector.name}`}
              className="text-sm font-medium"
            >
              {selector.label}
            </label>

            <select
              id={`group-${selector.name}`}
              {...register(selector.name)}
              aria-invalid={Boolean(errors[selector.name])}
              aria-describedby={
                errors[selector.name]
                  ? `group-${selector.name}-error`
                  : undefined
              }
              className={fieldClass}
            >
              <option value="">Selecciona una opción</option>

              {selector.options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>

            {errors[selector.name] && (
              <p
                id={`group-${selector.name}-error`}
                role="alert"
                className="mt-1 text-sm text-danger"
              >
                {errors[selector.name]?.message}
              </p>
            )}
          </div>
        ))}
      </fieldset>

      {missingOptions && (
        <p
          role="status"
          className="rounded-lg bg-warning-soft p-4 text-warning"
        >
          Necesitas una materia activa, un período no cerrado y un docente
          activo para crear un grupo.
        </p>
      )}

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
        disabled={isPending || missingOptions}
        className="rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-hover disabled:opacity-50"
      >
        {isPending ? "Creando…" : "Crear grupo"}
      </button>
    </form>
  );
}
