import { z } from "zod";

export const gradeSubmissionSchema = z.object({
  grade: z
    .string()
    .trim()
    .min(1, "Introduce una calificación")
    .refine((value) => {
      const grade = Number(value);

      return Number.isFinite(grade) && grade >= 1 && grade <= 100;
    }, "La calificación debe estar entre 1 y 100"),
  feedback: z.string().trim(),
});

export type GradeSubmissionFormValues = z.infer<typeof gradeSubmissionSchema>;
