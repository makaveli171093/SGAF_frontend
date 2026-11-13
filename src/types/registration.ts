export interface RegisterStudentInput {
  firstName: string;
  lastName: string;
  ci: string;
  phone?: string;
  email: string;
  password: string;
  guardianName: string;
  guardianPhone: string;
  guardianCi?: string;
}

export interface RegisterStudentResponse {
  message: string;

  student: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "STUDENT";
    status: "PENDING_APPROVAL";
    enrollmentCode: string;
  };

  enrollmentObligation: {
    id: string;
    amount: string | number;
    status: "PENDING";
    dueDate: string;
  };
}
