export interface StudentSubmission {
  id: string;
  textContent: string | null;
  fileUrl: string | null;
  grade: string | number | null;
  feedback: string | null;
  gradedAt: string | null;
  submittedAt: string;
}

export interface StudentAssignment {
  id: string;
  tittle: string;
  instructions: string;
  dueDate: string;

  group: {
    id: string;
    name: string;

    subject: {
      code: string;
      name: string;
    };

    teacher: {
      user: {
        firstName: string;
        lastName: string;
      };
    };
  };

  submissions: StudentSubmission[];
}

export interface MyAssignmentsResponse {
  message: string;
  assignments: StudentAssignment[];
}
