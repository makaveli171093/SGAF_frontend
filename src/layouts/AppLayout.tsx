import { NavLink, Outlet } from "react-router";
import { roleLabels } from "../constants/authLabels";
import { useAuthStore } from "../stores/authStore";
import type { UserRole } from "../types/auth";
import { Suspense } from "react";
import PageLoading from "../components/PageLoading";

interface NavigationItem {
  to: string;
  label: string;
  roles?: UserRole[];
}

const navigationItems: NavigationItem[] = [
  { to: "/cuenta", label: "Mi cuenta" },
  { to: "/grupos", label: "Grupos académicos" },
  {
    to: "/mis-inscripciones",
    label: "Mis inscripciones",
    roles: ["STUDENT"],
  },
  {
    to: "/mis-finanzas",
    label: "Mis finanzas",
    roles: ["STUDENT"],
  },
  {
    to: "/mis-tareas",
    label: "Mis tareas",
    roles: ["STUDENT"],
  },
  {
    to: "/docente/grupos",
    label: "Mis grupos",
    roles: ["TEACHER"],
  },
  {
    to: "/docente/tareas",
    label: "Tareas publicadas",
    roles: ["TEACHER"],
  },
  {
    to: "/recepcion/obligaciones",
    label: "Obligaciones pendientes",
    roles: ["RECEPCIONIST"],
  },
  {
    to: "/recepcion/pagos",
    label: "Pagos por verificar",
    roles: ["RECEPCIONIST"],
  },
  {
    to: "/recepcion/postulantes",
    label: "Postulantes pendientes",
    roles: ["RECEPCIONIST"],
  },
  {
    to: "/admin/usuarios",
    label: "Usuarios",
    roles: ["ADMIN"],
  },
  {
    to: "/admin/periodos",
    label: "Períodos académicos",
    roles: ["ADMIN"],
  },
  {
    to: "/admin/materias",
    label: "Materias",
    roles: ["ADMIN"],
  },
  {
    to: "/admin/grupos",
    label: "Grupos y horarios",
    roles: ["ADMIN"],
  },
];

export default function AppLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!user) return null;

  const visibleNavigationItems = navigationItems.filter(
    (item) => !item.roles || item.roles.includes(user.role),
  );

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <a
        href="#contenido"
        className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:not-sr-only focus:rounded-lg focus:bg-surface focus:px-4 focus:py-3 focus:text-brand"
      >
        Saltar al contenido
      </a>

      <aside className="bg-brand text-white lg:sticky lg:top-0 lg:h-dvh lg:self-start lg:overflow-y-auto">
        <div className="px-6 py-6 lg:px-8 lg:py-8">
          <p className="text-3xl font-bold tracking-wide">SGAF</p>

          <p className="mt-2 text-sm text-white/80">
            Gestión académica y financiera
          </p>

          <div
            aria-hidden="true"
            className="mt-5 h-1 w-12 rounded-full bg-accent"
          />
        </div>

        <nav aria-label="Navegación principal" className="space-y-2 px-4 pb-6">
          {visibleNavigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                [
                  "block rounded-xl px-4 py-3 text-sm font-semibold",
                  "transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2",
                  "focus-visible:outline-white",
                  isActive
                    ? "bg-accent-soft text-brand"
                    : "text-white/90 hover:bg-brand-hover",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-border bg-surface px-4 py-4 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm text-ink/70">{roleLabels[user.role]}</p>

              <p className="mt-1 wrap-break-word font-semibold text-brand">
                {user.firstName} {user.lastName}
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-brand px-4 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <main
          id="contenido"
          tabIndex={-1}
          className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8"
        >
          <Suspense fallback={<PageLoading />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
