import { z } from "zod";

const feeSchema = z
  .string()
  .trim()
  .min(1, "Introduce el importe")
  .refine(
    (value) => /^\d+(\.\d{1,2})?$/.test(value),
    "Introduce un importe positivo o cero, con hasta dos decimales",
  )
  .refine(
    (value) => Number(value) <= 99999999.99,
    "El importe supera el máximo permitido",
  );

export const subjectSchema = z.object({
  code: z.string().trim().min(1, "Introduce el código"),
  name: z.string().trim().min(1, "Introduce el nombre"),
  credits: z
    .string()
    .trim()
    .min(1, "Introduce los créditos")
    .refine((value) => {
      const credits = Number(value);
      return Number.isSafeInteger(credits) && credits >= 1;
    }, "Introduce un número entero mayor o igual a 1"),
  enrollmentFee: feeSchema,
  monthlyFee: feeSchema,
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;
