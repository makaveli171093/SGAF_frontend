import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { authService } from "../services/auth";
import { getApiErrorMessage } from "../lib/apiError";
import type { User } from "../types/auth";

type SessionStatus =
  | "idle"
  | "checking"
  | "authenticated"
  | "anonymous"
  | "error";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  sessionStatus: SessionStatus;
  sessionError: string | null;

  setSession: (accessToken: string, user: User) => void;
  restoreSession: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      sessionStatus: "idle",
      sessionError: null,

      setSession: (accessToken, user) => {
        set({
          accessToken,
          user,
          sessionStatus: "authenticated",
          sessionError: null,
        });
      },

      logout: () => {
        set({
          accessToken: null,
          user: null,
          sessionStatus: "anonymous",
          sessionError: null,
        });
      },

      restoreSession: async () => {
        if (get().sessionStatus === "checking") {
          return;
        }

        const token = get().accessToken;

        if (!token || typeof token !== "string") {
          get().logout();
          return;
        }

        set({
          user: null,
          sessionStatus: "checking",
          sessionError: null,
        });

        try {
          const response = await authService.getProfile(token);

          if (get().accessToken !== token) {
            return;
          }

          set({
            user: response.user,
            sessionStatus: "authenticated",
            sessionError: null,
          });
        } catch (error) {
          if (get().accessToken !== token) {
            return;
          }

          const status = axios.isAxiosError(error)
            ? error.response?.status
            : undefined;

          if (status === 401 || status === 403) {
            get().logout();
            return;
          }

          set({
            user: null,
            sessionStatus: "error",
            sessionError: getApiErrorMessage(error),
          });
        }
      },
    }),
    {
      name: "sgaf-session",
      storage: createJSONStorage(() => sessionStorage),

      partialize: (state) => ({
        accessToken: state.accessToken,
      }),
    },
  ),
);
