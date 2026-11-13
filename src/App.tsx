import { Outlet, Route, Routes } from "react-router";
import AppLayout from "./layouts/AppLayout";
import GuestRoute from "./routes/GuestRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import SessionGate from "./components/auth/SessionGate";
import PublicHomePage from "./pages/PublicHomePage";
import { lazy, Suspense } from "react";
import PageLoading from "./components/PageLoading";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const GroupsPage = lazy(() => import("./pages/GroupsPage"));
const MyEnrollmentsPage = lazy(() => import("./pages/MyEnrollmentsPage"));
const MyFinancesPage = lazy(() => import("./pages/MyFinancesPage"));
const MyAssignmentsPage = lazy(() => import("./pages/MyAssignmentsPage"));

const TeacherGroupsPage = lazy(() => import("./pages/TeacherGroupsPage"));
const TeacherAssignmentsPage = lazy(
  () => import("./pages/TeacherAssignmentsPage"),
);
const TeacherSubmissionsPage = lazy(
  () => import("./pages/TeacherSubmissionsPage"),
);

const PendingObligationsPage = lazy(
  () => import("./pages/PendingObligationsPage"),
);
const PendingManualPaymentsPage = lazy(
  () => import("./pages/PendingManualPaymentsPage"),
);
const PendingApplicantsPage = lazy(
  () => import("./pages/PendingApplicantsPage"),
);

const AdminUsersPage = lazy(() => import("./pages/AdminUsersPage"));
const CreateStaffPage = lazy(() => import("./pages/CreateStaffPage"));
const AcademicPeriodsPage = lazy(() => import("./pages/AcademicPeriodsPage"));
const SubjectsPage = lazy(() => import("./pages/SubjectsPage"));
const AdminGroupsPage = lazy(() => import("./pages/AdminGroupsPage"));

export default function App() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<PublicHomePage />} />

        <Route
          element={
            <SessionGate>
              <Outlet />
            </SessionGate>
          }
        >
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/cuenta" element={<AccountPage />} />
              <Route path="/grupos" element={<GroupsPage />} />

              <Route element={<RoleRoute allowedRoles={["STUDENT"]} />}>
                <Route
                  path="/mis-inscripciones"
                  element={<MyEnrollmentsPage />}
                />
                <Route path="/mis-finanzas" element={<MyFinancesPage />} />
                <Route path="/mis-tareas" element={<MyAssignmentsPage />} />
              </Route>

              <Route element={<RoleRoute allowedRoles={["TEACHER"]} />}>
                <Route path="/docente/grupos" element={<TeacherGroupsPage />} />
                <Route
                  path="/docente/tareas"
                  element={<TeacherAssignmentsPage />}
                />

                <Route
                  path="/docente/tareas/:assignmentId/entregas"
                  element={<TeacherSubmissionsPage />}
                />
              </Route>
              <Route element={<RoleRoute allowedRoles={["RECEPCIONIST"]} />}>
                <Route
                  path="/recepcion/obligaciones"
                  element={<PendingObligationsPage />}
                />
                <Route
                  path="/recepcion/pagos"
                  element={<PendingManualPaymentsPage />}
                />
                <Route
                  path="/recepcion/postulantes"
                  element={<PendingApplicantsPage />}
                />
              </Route>
              <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/admin/usuarios" element={<AdminUsersPage />} />
                <Route
                  path="/admin/usuarios/nuevo"
                  element={<CreateStaffPage />}
                />
                <Route
                  path="/admin/periodos"
                  element={<AcademicPeriodsPage />}
                />
                <Route path="/admin/materias" element={<SubjectsPage />} />
                <Route path="/admin/grupos" element={<AdminGroupsPage />} />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
