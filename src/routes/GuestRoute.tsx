import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../stores/authStore";

export default function GuestRoute() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionStatus = useAuthStore((state) => state.sessionStatus);

  const isAuthenticated =
    sessionStatus === "authenticated" && Boolean(user) && Boolean(accessToken);

  if (isAuthenticated) {
    return <Navigate to="/cuenta" replace />;
  }

  return <Outlet />;
}
