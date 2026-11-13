import axios from "axios";
import { useRef, useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NexoraLogo from "../components/brand/NexoraLogo";
import { getApiErrorMessage } from "../lib/apiError";
import { formatAmount, formatFinancialDate } from "../lib/finance";
import {
  registerSchema,
  type RegisterFormValues,
} from "../schemas/registerSchema";
import { registrationService } from "../services/registration";
import type { RegisterStudentResponse } from "../types/registration";

interface FormField {
  name: keyof RegisterFormValues;
  label: string;
  type?: "text" | "email" | "tel" | "password";
  autoComplete?: string;
}

const fieldGroups: { title: string; fields: FormField[] }[] = [
  {
    title: "Datos personales",
    fields: [
      {
        name: "firstName",
        label: "Nombres",
        autoComplete: "given-name",
      },
      {
        name: "lastName",
        label: "Apellidos",
        autoComplete: "family-name",
      },
      {
        name: "ci",
        label: "Documento de identidad",
      },
      {
        name: "phone",
        label: "Teléfono — opcional",
        type: "tel",
        autoComplete: "tel",
      },
    ],
  },
  {
    title: "Datos de acceso",
    fields: [
      {
        name: "email",
        label: "Correo electrónico",
        type: "email",
        autoComplete: "email",
      },
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
    ],
  },
  {
    title: "Tutor o responsable",
    fields: [
      {
        name: "guardianName",
        label: "Nombre completo",
        autoComplete: "section-guardian name",
      },
      {
        name: "guardianPhone",
        label: "Teléfono",
        type: "tel",
        autoComplete: "section-guardian tel",
      },
      {
        name: "guardianCi",
        label: "Documento de identidad — opcional",
      },
    ],
  },
];

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [result, setResult] = useState<RegisterStudentResponse | null>(null);

  const requestInProgress = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      ci: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      guardianName: "",
      guardianPhone: "",
      guardianCi: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    if (requestInProgress.current || result) return;

    setServerError(null);

    const confirmed = window.confirm(
      "¿Confirmas tu postulación a NEXORA?\n\n" +
        "Se creará tu cuenta pendiente de aprobación y una obligación de matrícula. " +
        "Recepción te orientará para completar el pago y la aprobación.",
    );

    if (!confirmed) return;

    requestInProgress.current = true;

    try {
      const response = await registrationService.register({
        firstName: values.firstName,
        lastName: values.lastName,
        ci: values.ci,
        phone: values.phone || undefined,
        email: values.email,
        password: values.password,
        guardianName: values.guardianName,
        guardianPhone: values.guardianPhone,
        guardianCi: values.guardianCi || undefined,
      });

      reset();
      setResult(response);
    } catch (error: unknown) {
      const uncertainResult =
        axios.isAxiosError(error) &&
        (!error.response || error.response.status >= 500);

      setServerError(
        uncertainResult
          ? "No pudimos confirmar el registro. Consulta con recepción usando tu correo antes de volver a intentarlo."
          : getApiErrorMessage(error),
      );
    } finally {
      requestInProgress.current = false;
    }
  }

  const whatsappUrl =
    "https://wa.me/591611700006?text=" +
    encodeURIComponent(
      result
        ? `Hola, registré mi postulación a NEXORA. Mi código de matrícula es ${result.student.enrollmentCode}. Quiero información para completar el proceso.`
        : "Hola, necesito ayuda con mi registro en NEXORA.",
    );

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <Link to="/" aria-label="NEXORA, inicio">
            <NexoraLogo />
          </Link>

          <Link
            to="/login"
            className="font-medium text-brand underline underline-offset-4"
          >
            Iniciar sesión
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10">
        {result ? (
          <section
            aria-labelledby="registration-success-title"
            className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
          >
            <p role="status" className="font-semibold text-success">
              {result.message}
            </p>

            <h1
              id="registration-success-title"
              className="mt-3 text-3xl font-bold text-brand"
            >
              Tu siguiente paso comienza aquí.
            </h1>

            <p className="mt-4">
              {result.student.firstName}, tu cuenta está pendiente de
              aprobación. Conserva estos datos para comunicarte con recepción.
            </p>

            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-ink/70">Código de matrícula</dt>
                <dd className="mt-1 wrap-break-word text-xl font-bold text-brand">
                  {result.student.enrollmentCode}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-ink/70">Correo registrado</dt>
                <dd className="mt-1 wrap-break-word font-medium">
                  {result.student.email}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-ink/70">Importe de matrícula</dt>
                <dd className="mt-1 font-medium">
                  {formatAmount(result.enrollmentObligation.amount)}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-ink/70">Vencimiento — Bolivia</dt>
                <dd className="mt-1 font-medium">
                  {formatFinancialDate(result.enrollmentObligation.dueDate)}
                </dd>
              </div>
            </dl>

            <div className="mt-6 rounded-xl bg-accent-soft p-5">
              <h2 className="font-semibold text-brand">
                Cómo completar tu ingreso
              </h2>

              <ol className="mt-3 list-decimal space-y-2 pl-5">
                <li>Contacta con recepción e indica tu código de matrícula.</li>
                <li>
                  Consulta la moneda y las instrucciones para realizar el pago
                  por efectivo o transferencia.
                </li>
                <li>Recepción verificará el pago y aprobará tu postulación.</li>
                <li>Después podrás ingresar con tu correo y contraseña.</li>
              </ol>
            </div>

            <p className="mt-5 text-sm text-ink/70">
              Guarda o imprime esta confirmación antes de salir. No es un
              comprobante de pago.
            </p>

            <div className="mt-5 flex flex-wrap gap-3 print:hidden">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-hover"
              >
                Contactar con recepción
              </a>

              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-lg border border-brand px-5 py-3 font-medium text-brand hover:bg-accent-soft"
              >
                Imprimir o guardar PDF
              </button>
            </div>
          </section>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-brand">Postula a NEXORA</h1>

            <p className="mt-3 text-ink/75">
              Completa tus datos para iniciar el proceso de ingreso. El registro
              genera una obligación de matrícula y tu cuenta quedará pendiente
              de aprobación.
            </p>

            <p className="mt-2 text-sm text-ink/70">
              Todos los campos son obligatorios salvo los indicados como
              opcionales.
            </p>

            <form
              noValidate
              onSubmit={(event) => {
                void handleSubmit(onSubmit)(event);
              }}
              aria-busy={isSubmitting}
              className="mt-8 space-y-7"
            >
              {fieldGroups.map((group) => (
                <fieldset
                  key={group.title}
                  disabled={isSubmitting}
                  className="rounded-2xl border border-border bg-surface p-6"
                >
                  <legend className="px-2 text-lg font-semibold text-brand">
                    {group.title}
                  </legend>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {group.fields.map((field) => {
                      const error = errors[field.name];
                      const id = `register-${field.name}`;

                      return (
                        <div key={field.name} className="min-w-0">
                          <label
                            htmlFor={id}
                            className="block text-sm font-medium"
                          >
                            {field.label}
                          </label>

                          <input
                            id={id}
                            type={field.type ?? "text"}
                            autoComplete={field.autoComplete}
                            {...register(field.name)}
                            aria-invalid={Boolean(error)}
                            aria-describedby={error ? `${id}-error` : undefined}
                            className="mt-2 w-full rounded-lg border border-border bg-surface p-3 focus:border-brand focus:outline-2 focus:outline-brand disabled:opacity-50"
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
                </fieldset>
              ))}

              {serverError && (
                <p
                  role="alert"
                  className="rounded-xl bg-danger-soft p-5 text-danger"
                >
                  {serverError}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
                >
                  {isSubmitting ? "Registrando…" : "Enviar postulación"}
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand underline underline-offset-4"
                >
                  Necesito ayuda
                </a>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
