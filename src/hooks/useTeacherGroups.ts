import axios from "axios";
import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../lib/apiError";
import { groupsService } from "../services/groups";
import { useAuthStore } from "../stores/authStore";
import type { TeacherGroup } from "../types/groups";

export function useTeacherGroups() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);

  const [groups, setGroups] = useState<TeacherGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!accessToken) return;

    const controller = new AbortController();

    async function loadGroups(token: string) {
      try {
        const response = await groupsService.getMine(token, controller.signal);

        if (controller.signal.aborted) return;
        if (useAuthStore.getState().accessToken !== token) return;

        setGroups(response.groups);
      } catch (error: unknown) {
        if (controller.signal.aborted) return;
        if (useAuthStore.getState().accessToken !== token) return;

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          logout();
          return;
        }

        setError(getApiErrorMessage(error));
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadGroups(accessToken);

    return () => {
      controller.abort();
    };
  }, [accessToken, logout, requestVersion]);

  function reload() {
    setIsLoading(true);
    setError(null);
    setGroups([]);
    setRequestVersion((current) => current + 1);
  }

  function registerCreatedAssignment(groupId: string) {
    setGroups((current) =>
      current.map((group) =>
        group.id === groupId
          ? {
              ...group,
              _count: {
                ...group._count,
                assignments: group._count.assignments + 1,
              },
            }
          : group,
      ),
    );
  }

  return { groups, isLoading, error, reload, registerCreatedAssignment };
}
