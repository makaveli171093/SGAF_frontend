import type { User } from "./auth";
import type { ObligationStatus } from "./payments";

export interface PendingApplicant extends User {
  stundentProfile: {
    enrollmentCode: string;
    financialObligations: {
      id: string;
      amount: string | number;
      status: ObligationStatus;
      dueDate: string;
    }[];
  } | null;
}

export interface PendingApplicantsResponse {
  message: string;
  applicants: PendingApplicant[];
}

export interface ApproveApplicantResponse {
  message: string;
  user: User;
}
