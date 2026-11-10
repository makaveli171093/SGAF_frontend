import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authService } from "../services/auth";
import { useAuthStore } from "../stores/authStore";
import { getApiErrorMessage } from "../lib/apiError";
import { loginSchema } from "../schemas/loginSchema";
import type { LoginFormValues } from "../schemas/loginSchema";

export default function LoginPage() {
  const setSession = useAuthStore((state) => state.setSession);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);

    try {
      const response = await authService.login(values);

      setSession(response.accessToken, response.user);
    } catch (error) {
      setServerError(getApiErrorMessage(error));
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center p-4 sm:p-8">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface shadow-sm md:grid-cols-2">
        <section className="flex flex-col justify-between bg-brand p-8 text-white sm:p-10">
          <p className="text-2xl font-bold tracking-tight">SGAF</p>

          <div className="my-10">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-white/80">
              Gestión académica y financiera
            </p>

            <h1 className="text-3xl font-semibold leading-tight">
              Tu comunidad educativa,
              <br />
              en un mismo lugar.
            </h1>

            <p className="mt-5 leading-relaxed text-white/80">
              Accede a tus actividades académicas y gestiona la información que
              corresponde a tu cuenta.
            </p>
          </div>

          <div className="h-1 w-16 rounded-full bg-accent" />
        </section>

        <section
          className="flex flex-col justify-center p-8 sm:p-10"
          aria-labelledby="login-title"
        >
          <h2 id="login-title" className="text-2xl font-semibold text-brand">
            Iniciar sesión
          </h2>

          <p className="mt-2 text-sm">Ingresa con tu correo y contraseña.</p>

          <form
            className="mt-8 space-y-5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-busy={isSubmitting}
          >
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Correo electrónico
              </label>

              <input
                id="email"
                type="email"
                autoComplete="username"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="w-full rounded-lg border border-border bg-surface px-3 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-60"
                {...register("email")}
              />

              {errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  className="mt-2 text-sm text-danger"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Contraseña
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className="w-full rounded-lg border border-border bg-surface px-3 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-60"
                {...register("password")}
              />

              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="mt-2 text-sm text-danger"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            {serverError && (
              <p
                role="alert"
                className="rounded-lg bg-danger-soft p-3 text-sm text-danger"
              >
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-brand px-4 py-3 font-medium text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
            >
              {isSubmitting ? "Ingresando…" : "Ingresar"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
