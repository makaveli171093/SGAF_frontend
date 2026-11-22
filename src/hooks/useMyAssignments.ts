import { useAuthenticatedQuery } from "./useAuthenticatedQuery";
import { assignmentsService } from "../services/assignments";
import type { StudentSubmission } from "../types/assignments";

async function loadAssignments(token: string, signal: AbortSignal) {
  const response = await assignmentsService.getMine(token, signal);
  return { ...response, checkedAt: Date.now() };
}

export function useMyAssignments() {
  const query = useAuthenticatedQuery(loadAssignments, true);

  function registerSubmission(assignmentId: string, submission: StudentSubmission) {
    query.updateData((current) => ({
      ...current,
      assignments: current.assignments.map((assignment) =>
        assignment.id === assignmentId
          ? { ...assignment, submissions: [submission] }
          : assignment,
      ),
    }));
  }

  return { ...query, registerSubmission };
}
