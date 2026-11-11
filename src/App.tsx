import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuthStore } from "./stores/authStore";

export default function App() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionStatus = useAuthStore((state) => state.sessionStatus);
  const sessionError = useAuthStore((state) => state.sessionError);
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  if (sessionStatus === "idle" || sessionStatus === "checking") {
    return (
      <main className="flex min-h-dvh items-center justify-center p-6">
        <div role="status" className="text-center">
          <p className="text-2xl font-bold text-brand">SGAF</p>
          <p className="mt-3">Comprobando tu sesión…</p>
        </div>
      </main>
    );
  }

  if (sessionStatus === "error") {
    return (
      <main className="flex min-h-dvh items-center justify-center p-6">
        <section className="w-full max-w-md rounded-2xl border border-border bg-surface p-8">
          <h1 className="text-xl font-semibold text-brand">
            No pudimos comprobar tu sesión
          </h1>

          <p role="alert" className="mt-4">
            {sessionError}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void restoreSession()}
              className="rounded-lg bg-brand px-4 py-3 font-medium text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Reintentar
            </button>

            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-brand px-4 py-3 font-medium text-brand hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </section>
      </main>
    );
  }

  const isAuthenticated =
    sessionStatus === "authenticated" && Boolean(user) && Boolean(accessToken);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? "/cuenta" : "/login"} replace />
        }
      />

      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/cuenta" replace /> : <LoginPage />
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/cuenta" element={<AccountPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
