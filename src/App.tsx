import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import { useAuthStore } from "./stores/authStore";

export default function App() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!user || !accessToken) {
    return <LoginPage />;
  }

  return <AccountPage />;
}
