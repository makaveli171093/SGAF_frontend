import type { StudentAssignment, StudentSubmission, TeacherAssignment, TeacherSubmission } from "../types/assignments";

type Assignment = StudentAssignment | TeacherAssignment;

export function matchesSearch(query: string, text: string) {
  const normalize = (value: string) =>
    value.toLocaleLowerCase("es").normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const searchable = normalize(text);
  return normalize(query).trim().split(/\s+/u).every((word) => searchable.includes(word));
}

export function submissionStatus(submission: StudentSubmission | undefined) {
  if (!submission) return "missing";
  return submission.grade === null ? "pending" : "graded";
}

export function assignmentStatus(assignment: Assignment, now: number) {
  const status = "submissions" in assignment && submissionStatus(assignment.submissions[0]);
  if (status && status !== "missing") return status;
  return Date.parse(assignment.dueDate) < now ? "closed" : "open";
}

export const defaultAssignmentFilters = {
  query: "",
  subject: "",
  status: "",
  sort: "soonest",
};

export function filterAssignments<T extends Assignment>(
  assignments: T[],
  filters: typeof defaultAssignmentFilters,
  now: number,
) {
  return assignments.filter((assignment) => {
    const { subject, name } = assignment.group;
    return (!filters.subject || subject.code === filters.subject)
      && (!filters.status || assignmentStatus(assignment, now) === filters.status)
      && matchesSearch(filters.query, [assignment.tittle, assignment.instructions, subject.name, subject.code, name].join(" "));
  }).sort((left, right) => {
    if (filters.sort === "title") return left.tittle.localeCompare(right.tittle, "es");
    const difference = Date.parse(left.dueDate) - Date.parse(right.dueDate);
    return filters.sort === "latest" ? -difference : difference;
  });
}

export function filterSubmissions(submissions: TeacherSubmission[], query: string, status: string) {
  return submissions.filter(({ student, ...submission }) =>
    (!status || submissionStatus(submission) === status)
    && matchesSearch(query, `${student.user.firstName} ${student.user.lastName} ${student.enrollmentCode}`),
  );
}

export const assignmentPageSize = 6;

export function assignmentPage<T>(items: T[], requestedPage: number) {
  const page = Math.min(requestedPage, Math.max(1, Math.ceil(items.length / assignmentPageSize)));
  const offset = (page - 1) * assignmentPageSize;
  return { page, items: items.slice(offset, offset + assignmentPageSize) };
}

export function upcomingAssignments<T extends Assignment>(assignments: T[], now: number) {
  const end = now + 7 * 24 * 60 * 60 * 1000;
  return filterAssignments(assignments, { ...defaultAssignmentFilters, status: "open" }, now)
    .filter(({ dueDate }) => {
      const deadline = Date.parse(dueDate);
      return deadline >= now && deadline <= end;
    });
}
