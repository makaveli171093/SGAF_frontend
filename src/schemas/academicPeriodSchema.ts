import { z } from "zod";

function isValidDateTime(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}:00.000Z`);

  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 16) === value
  );
}

export function periodDateToISO(value: string): string {
  return new Date(`${value}:00-04:00`).toISOString();
}

export const academicPeriodSchema = z
  .object({
    name: z.string().trim().min(1, "Introduce el nombre del período"),
    startDate: z
      .string()
      .refine(isValidDateTime, "Selecciona una fecha y hora válidas"),
    endDate: z
      .string()
      .refine(isValidDateTime, "Selecciona una fecha y hora válidas"),
    maxCredits: z
      .string()
      .trim()
      .min(1, "Introduce el máximo de créditos")
      .refine((value) => {
        const credits = Number(value);
        return Number.isSafeInteger(credits) && credits >= 1;
      }, "Introduce un número entero mayor o igual a 1"),
  })
  .refine(
    (values) => {
      if (
        !isValidDateTime(values.startDate) ||
        !isValidDateTime(values.endDate)
      ) {
        return true;
      }

      return values.startDate < values.endDate;
    },
    {
      message: "La finalización debe ser posterior al inicio",
      path: ["endDate"],
    },
  );

export type AcademicPeriodFormValues = z.infer<typeof academicPeriodSchema>;
