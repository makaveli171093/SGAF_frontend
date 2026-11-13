export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  enrollmentFee: string | number;
  monthlyFee: string | number;
  active: boolean;
}

export interface SubjectsResponse {
  message: string;
  subjects: Subject[];
}

export interface CreateSubjectInput {
  code: string;
  name: string;
  credits: number;
  enrollmentFee: number;
  monthlyFee: number;
}

export interface CreateSubjectResponse {
  message: string;
  subject: Subject;
}
