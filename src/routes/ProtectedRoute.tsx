import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../stores/authStore.ts";

export default function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionStatus = useAuthStore((state) => state.sessionStatus);

  if (sessionStatus === "idle" || sessionStatus === "checking") {
    return null;
  }

  if (sessionStatus !== "authenticated" || !user || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
