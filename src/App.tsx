import { Navigate, Route, Routes } from "react-router";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import NotFoundPage from "./pages/NotFoundPage";
import GuestRoute from "./routes/GuestRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import GroupsPage from "./pages/GroupsPage";
import MyEnrollmentsPage from "./pages/MyEnrollmentsPage";
import RoleRoute from "./routes/RoleRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/cuenta" replace />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/cuenta" element={<AccountPage />} />
          <Route path="/grupos" element={<GroupsPage />} />

          <Route element={<RoleRoute allowedRoles={["STUDENT"]} />}>
            <Route path="/mis-inscripciones" element={<MyEnrollmentsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
