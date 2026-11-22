import { useAuthenticatedQuery } from "./useAuthenticatedQuery";
import { groupsService } from "../services/groups";

export function useTeacherGroups() {
  const query = useAuthenticatedQuery(groupsService.getMine, true);

  function registerCreatedAssignment(groupId: string) {
    query.updateData((current) => ({
      ...current,
      groups: current.groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              _count: { ...group._count, assignments: group._count.assignments + 1 },
            }
          : group,
      ),
    }));
  }

  return { ...query, registerCreatedAssignment };
}
