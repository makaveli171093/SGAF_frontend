import { NavLink, Outlet, useLocation, Link } from "react-router";
import { Suspense, useEffect, useState } from "react";
import { roleLabels } from "../constants/authLabels";
import { useAuthStore } from "../stores/authStore";
import type { UserRole } from "../types/auth";
import PageLoading from "../components/PageLoading";
import Avatar from "../components/ui/Avatar";
import Modal from "../components/ui/Modal";
import AppIcon from "../components/ui/AppIcon";
import NexoraLogo from "../components/brand/NexoraLogo";
import type { AppIconName } from "../types/navigation";

interface NavigationItem {
  to: string;
  label: string;
  icon: AppIconName;
  section: string;
  roles?: UserRole[];
}
const navigationItems: NavigationItem[] = [
  { to: "/inicio", label: "Inicio", icon: "home", section: "MI ESPACIO" },
  {
    to: "/admin/reportes",
    label: "Métricas y reportes",
    icon: "chart",
    section: "MI ESPACIO",
    roles: ["ADMIN"],
  },
  {
    to: "/grupos",
    label: "Grupos académicos",
    icon: "grid",
    section: "ACADÉMICO",
  },
  {
    to: "/mis-inscripciones",
    label: "Mis inscripciones",
    icon: "book",
    section: "ACADÉMICO",
    roles: ["STUDENT"],
  },
  {
    to: "/mis-tareas",
    label: "Mis tareas",
    icon: "task",
    section: "ACADÉMICO",
    roles: ["STUDENT"],
  },
  {
    to: "/mis-finanzas",
    label: "Mis finanzas",
    icon: "wallet",
    section: "ACADÉMICO",
    roles: ["STUDENT"],
  },
  {
    to: "/docente/grupos",
    label: "Mis grupos",
    icon: "users",
    section: "ACADÉMICO",
    roles: ["TEACHER"],
  },
  {
    to: "/docente/tareas",
    label: "Tareas publicadas",
    icon: "task",
    section: "ACADÉMICO",
    roles: ["TEACHER"],
  },
  {
    to: "/recepcion/obligaciones",
    label: "Obligaciones pendientes",
    icon: "wallet",
    section: "RECEPCIÓN",
    roles: ["RECEPCIONIST"],
  },
  {
    to: "/recepcion/pagos",
    label: "Pagos por verificar",
    icon: "check",
    section: "RECEPCIÓN",
    roles: ["RECEPCIONIST"],
  },
  {
    to: "/recepcion/postulantes",
    label: "Postulantes",
    icon: "users",
    section: "RECEPCIÓN",
    roles: ["RECEPCIONIST"],
  },
  {
    to: "/admin/usuarios",
    label: "Usuarios",
    icon: "users",
    section: "ADMINISTRACIÓN",
    roles: ["ADMIN"],
  },
  {
    to: "/admin/periodos",
    label: "Periodos académicos",
    icon: "calendar",
    section: "ADMINISTRACIÓN",
    roles: ["ADMIN"],
  },
  {
    to: "/admin/materias",
    label: "Materias",
    icon: "book",
    section: "ADMINISTRACIÓN",
    roles: ["ADMIN"],
  },
  {
    to: "/admin/grupos",
    label: "Grupos y horarios",
    icon: "grid",
    section: "ADMINISTRACIÓN",
    roles: ["ADMIN"],
  },
  { to: "/cuenta", label: "Mi cuenta", icon: "user", section: "PERSONAL" },
];
export default function AppLayout() {
  const user = useAuthStore((state) => state.user),
    logout = useAuthStore((state) => state.logout),
    location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.getElementById("contenido")?.focus({ preventScroll: true });
  }, [location.pathname]);
  if (!user) return null;
  const items = navigationItems.filter(
    (item) => !item.roles || item.roles.includes(user.role),
  );
  const sections = [...new Set(items.map((item) => item.section))];
  const active =
    items.find((item) => item.to === location.pathname)?.label ??
    (location.pathname.includes("/entregas")
      ? "Entregas de la tarea"
      : location.pathname === "/admin/usuarios/nuevo"
        ? "Crear usuario"
        : "Aula virtual");
  function navigation(mobile = false) {
    return (
      <nav
        aria-label={mobile ? "Navegación móvil" : "Navegación principal"}
        className="nexora-nav"
      >
        {sections.map((section) => (
          <div key={section} className="nav-section">
            <p className="nav-section-label">{section}</p>
            {items
              .filter((item) => item.section === section)
              .map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "is-active" : ""}`
                  }
                >
                  <AppIcon name={item.icon} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
          </div>
        ))}
      </nav>
    );
  }
  return (
    <div className="app-shell">
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <aside className="desktop-sidebar">
        <Link
          to="/inicio"
          className="sidebar-brand"
          aria-label="NEXORA, inicio"
        >
          <NexoraLogo light campus />
        </Link>
        {navigation()}
        <div className="sidebar-foot">
          <span className="sidebar-foot-line" />
          <p>Aprende. Conecta. Avanza.</p>
          <small>La Paz, Bolivia</small>
        </div>
      </aside>
      <div className="app-content">
        <header className="app-header">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Abrir menú"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="menu-trigger"
            >
              <AppIcon name="menu" />
            </button>
            <div className="min-w-0">
              <p className="header-eyebrow">CAMPUS / {roleLabels[user.role]}</p>
              <p className="header-title truncate">{active}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <Link
              to="/cuenta"
              className="header-profile"
              aria-label="Mi cuenta"
            >
              <div className="hidden text-right md:block">
                <p className="text-sm font-semibold">
                  {user.firstName} {user.lastName}
                </p>
                <p className="mt-0.5 text-xs text-ink/60">
                  {roleLabels[user.role]}
                </p>
              </div>
              <Avatar user={user} />
            </Link>
            <button
              type="button"
              onClick={logout}
              className="logout-button"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <AppIcon name="exit" />
              <span className="hidden xl:inline">Salir</span>
            </button>
          </div>
        </header>
        <main id="contenido" tabIndex={-1} className="workspace-main">
          <Suspense fallback={<PageLoading />}>
            <Outlet />
          </Suspense>
        </main>
        <footer className="workspace-footer">
          <span>NEXORA · Gestión académica y financiera</span>
          <span>La Paz, Bolivia</span>
        </footer>
      </div>
      {mobileOpen && (
        <Modal title="NEXORA · Menú" onClose={() => setMobileOpen(false)}>
          <div className="mobile-navigation">{navigation(true)}</div>
        </Modal>
      )}
    </div>
  );
}
