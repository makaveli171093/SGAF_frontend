import { useState } from "react";
import { Link } from "react-router";
import NexoraLogo from "../components/brand/NexoraLogo";
import CampusArtwork from "../components/brand/CampusArtwork";
import AppIcon from "../components/ui/AppIcon";
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
    <main className="auth-page">
      <section className="auth-story">
        <Link to="/" aria-label="NEXORA, inicio">
          <NexoraLogo light campus />
        </Link>
        <div className="auth-story-center">
          <p className="eyebrow">TU CAMPUS, A TU ALCANCE</p>
          <h1>
            Un espacio para aprender.
            <br />
            <span>Y seguir creciendo.</span>
          </h1>
          <CampusArtwork />
        </div>
        <div className="auth-story-foot">
          <span>Gestión académica y financiera</span>
          <span>La Paz, Bolivia</span>
        </div>
      </section>
      <section className="auth-form-panel" aria-labelledby="login-title">
        <div className="auth-form-inner">
          <Link to="/" className="auth-back">
            <AppIcon name="arrow" /> Volver a NEXORA
          </Link>
          <p className="eyebrow">AULA VIRTUAL</p>
          <h2 id="login-title">Qué bueno verte.</h2>
          <p className="auth-description">
            Inicia sesión con tu correo y contraseña para acceder a tu espacio.
          </p>

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
              {isSubmitting ? "Ingresando…" : "Ingresar al campus"}
            </button>
          </form>
          <p className="auth-register-link">
            ¿Aún no eres parte? <Link to="/registro">Postula aquí →</Link>
          </p>
          <p className="auth-footer">
            NEXORA · Tu comunidad educativa, en un mismo lugar.
          </p>
        </div>
      </section>
    </main>
  );
}
