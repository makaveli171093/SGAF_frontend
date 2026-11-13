import { Outlet, Route, Routes } from "react-router";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import NotFoundPage from "./pages/NotFoundPage";
import GuestRoute from "./routes/GuestRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import GroupsPage from "./pages/GroupsPage";
import MyEnrollmentsPage from "./pages/MyEnrollmentsPage";
import RoleRoute from "./routes/RoleRoute";
import MyFinancesPage from "./pages/MyFinancesPage";
import MyAssignmentsPage from "./pages/MyAssignmentsPage";
import TeacherGroupsPage from "./pages/TeacherGroupsPage";
import TeacherAssignmentsPage from "./pages/TeacherAssignmentsPage";
import TeacherSubmissionsPage from "./pages/TeacherSubmissionsPage";
import PendingObligationsPage from "./pages/PendingObligationsPage";
import PendingManualPaymentsPage from "./pages/PendingManualPaymentsPage";
import PendingApplicantsPage from "./pages/PendingApplicantsPage";
import SessionGate from "./components/auth/SessionGate";
import PublicHomePage from "./pages/PublicHomePage";
import RegisterPage from "./pages/RegisterPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import CreateStaffPage from "./pages/CreateStaffPage";
import AcademicPeriodsPage from "./pages/AcademicPeriodsPage";
import SubjectsPage from "./pages/SubjectsPage";

export default function App() {
  return (
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
              <Route path="/admin/periodos" element={<AcademicPeriodsPage />} />
              <Route path="/admin/materias" element={<SubjectsPage />} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
