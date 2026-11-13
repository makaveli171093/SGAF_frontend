import axios from "axios";
import { useRef, useState } from "react";
import { Link } from "react-router";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roleLabels } from "../constants/authLabels";
import { getApiErrorMessage } from "../lib/apiError";
import { staffSchema, type StaffFormValues } from "../schemas/staffSchema";
import { usersService } from "../services/users";
import { useAuthStore } from "../stores/authStore";
import type { CreateStaffResponse } from "../types/users";

interface FieldDefinition {
  name: keyof StaffFormValues;
  label: string;
  type?: "text" | "email" | "tel" | "password";
  autoComplete?: string;
}

const fields: FieldDefinition[] = [
  { name: "firstName", label: "Nombres" },
  { name: "lastName", label: "Apellidos" },
  { name: "ci", label: "Documento de identidad" },
  { name: "phone", label: "Teléfono — opcional", type: "tel" },
  { name: "email", label: "Correo electrónico", type: "email" },
  {
    name: "password",
    label: "Contraseña — mínimo 8 caracteres",
    type: "password",
    autoComplete: "new-password",
  },
  {
    name: "confirmPassword",
    label: "Confirmar contraseña",
    type: "password",
    autoComplete: "new-password",
  },
];

export default function CreateStaffPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateStaffResponse | null>(null);
  const requestInProgress = useRef(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      ci: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "TEACHER",
      specialty: "",
      hireDate: "",
    },
  });

  const selectedRole = useWatch({
    control,
    name: "role",
  });

  async function onSubmit(values: StaffFormValues) {
    if (requestInProgress.current || result) return;

    setServerError(null);

    const { accessToken, user } = useAuthStore.getState();

    if (!accessToken || user?.role !== "ADMIN") return;

    const confirmed = window.confirm(
      `¿Crear la cuenta de ${values.firstName} ${values.lastName}?\n\n` +
        `Correo: ${values.email}\n` +
        `Rol: ${roleLabels[values.role]}\n\n` +
        "La cuenta quedará activa con los permisos del rol seleccionado.",
    );

    if (!confirmed) return;

    requestInProgress.current = true;

    try {
      const response = await usersService.createStaff(accessToken, {
        firstName: values.firstName,
        lastName: values.lastName,
        ci: values.ci,
        phone: values.phone || undefined,
        email: values.email,
        password: values.password,
        role: values.role,
        ...(values.role === "TEACHER"
          ? {
              specialty: values.specialty,
              hireDate: `${values.hireDate}T00:00:00.000Z`,
            }
          : {}),
      });

      if (useAuthStore.getState().accessToken !== accessToken) {
        return;
      }

      reset();
      setResult(response);
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
          ? "No pudimos confirmar la creación. Consulta la lista de usuarios antes de volver a intentarlo."
          : getApiErrorMessage(error),
      );
    } finally {
      requestInProgress.current = false;
    }
  }

  function startAnother() {
    reset();
    setResult(null);
    setServerError(null);
  }

  const fieldClass =
    "mt-2 w-full rounded-lg border border-border bg-surface p-3 focus:border-brand focus:outline-2 focus:outline-brand disabled:opacity-50";

  return (
    <section aria-labelledby="create-staff-title">
      <Link
        to="/admin/usuarios"
        className="mb-5 inline-block font-medium text-brand underline underline-offset-4"
      >
        Volver a usuarios
      </Link>

      <h1
        id="create-staff-title"
        className="text-2xl font-bold text-brand sm:text-3xl"
      >
        Crear usuario interno
      </h1>

      <p className="mt-3 text-ink/70">
        Registra docentes, personal de recepción o administradores.
      </p>

      {result ? (
        <div className="mt-6 rounded-2xl border border-border bg-surface p-6">
          <p role="status" className="font-semibold text-success">
            {result.message}
          </p>

          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-ink/70">Nombre</dt>
              <dd className="mt-1 wrap-break-word font-medium">
                {result.user.firstName} {result.user.lastName}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-ink/70">Correo</dt>
              <dd className="mt-1 wrap-break-word font-medium">
                {result.user.email}
              </dd>
            </div>

            <div>
              <dt className="text-sm text-ink/70">Rol</dt>
              <dd className="mt-1 font-medium">
                {roleLabels[result.user.role]}
              </dd>
            </div>

            {result.user.teacherProfile && (
              <div>
                <dt className="text-sm text-ink/70">Especialidad</dt>
                <dd className="mt-1 wrap-break-word font-medium">
                  {result.user.teacherProfile.specialty}
                </dd>
              </div>
            )}
          </dl>

          <p className="mt-5 text-sm text-ink/70">
            La cuenta está activa. Su titular puede iniciar sesión con el correo
            y la contraseña definidos.
          </p>

          <button
            type="button"
            onClick={startAnother}
            className="mt-5 rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-hover"
          >
            Crear otro usuario
          </button>
        </div>
      ) : (
        <form
          noValidate
          onSubmit={(event) => {
            void handleSubmit(onSubmit)(event);
          }}
          aria-busy={isSubmitting}
          className="mt-6 space-y-6 rounded-2xl border border-border bg-surface p-6"
        >
          <div>
            <label htmlFor="staff-role" className="block text-sm font-medium">
              Rol
            </label>

            <select
              id="staff-role"
              {...register("role")}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.role)}
              aria-describedby={errors.role ? "staff-role-error" : undefined}
              className={fieldClass}
            >
              <option value="TEACHER">Docente</option>
              <option value="RECEPCIONIST">Recepción</option>
              <option value="ADMIN">Administrador</option>
            </select>

            {errors.role && (
              <p
                id="staff-role-error"
                role="alert"
                className="mt-1 text-sm text-danger"
              >
                {errors.role.message}
              </p>
            )}

            {selectedRole === "ADMIN" && (
              <p className="mt-2 text-sm text-ink/70">
                Este rol permite administrar usuarios y la configuración
                académica disponible en el sistema.
              </p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((field) => {
              const error = errors[field.name];
              const id = `staff-${field.name}`;

              return (
                <div key={field.name} className="min-w-0">
                  <label htmlFor={id} className="block text-sm font-medium">
                    {field.label}
                  </label>

                  <input
                    id={id}
                    type={field.type ?? "text"}
                    autoComplete={field.autoComplete ?? "off"}
                    {...register(field.name)}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${id}-error` : undefined}
                    className={fieldClass}
                  />

                  {error && (
                    <p
                      id={`${id}-error`}
                      role="alert"
                      className="mt-1 text-sm text-danger"
                    >
                      {error.message}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {selectedRole === "TEACHER" && (
            <fieldset
              disabled={isSubmitting}
              className="rounded-xl border border-border p-4"
            >
              <legend className="px-2 font-semibold text-brand">
                Perfil docente
              </legend>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="staff-specialty"
                    className="block text-sm font-medium"
                  >
                    Especialidad
                  </label>

                  <input
                    id="staff-specialty"
                    {...register("specialty")}
                    aria-invalid={Boolean(errors.specialty)}
                    aria-describedby={
                      errors.specialty ? "staff-specialty-error" : undefined
                    }
                    className={fieldClass}
                  />

                  {errors.specialty && (
                    <p
                      id="staff-specialty-error"
                      role="alert"
                      className="mt-1 text-sm text-danger"
                    >
                      {errors.specialty.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="staff-hire-date"
                    className="block text-sm font-medium"
                  >
                    Fecha de contratación
                  </label>

                  <input
                    id="staff-hire-date"
                    type="date"
                    {...register("hireDate")}
                    aria-invalid={Boolean(errors.hireDate)}
                    aria-describedby={
                      errors.hireDate ? "staff-hire-date-error" : undefined
                    }
                    className={`${fieldClass} min-w-0`}
                  />

                  {errors.hireDate && (
                    <p
                      id="staff-hire-date-error"
                      role="alert"
                      className="mt-1 text-sm text-danger"
                    >
                      {errors.hireDate.message}
                    </p>
                  )}
                </div>
              </div>
            </fieldset>
          )}

          {serverError && (
            <p
              role="alert"
              className="rounded-xl bg-danger-soft p-4 text-danger"
            >
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
          >
            {isSubmitting ? "Creando…" : "Crear usuario"}
          </button>
        </form>
      )}
    </section>
  );
}
