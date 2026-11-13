import { z } from "zod";

export const groupSchema = z.object({
  name: z.string().trim().min(1, "Introduce el nombre del grupo"),
  maxCapacity: z
    .string()
    .trim()
    .refine((value) => {
      const capacity = Number(value);
      return Number.isSafeInteger(capacity) && capacity >= 1;
    }, "Introduce una capacidad entera mayor o igual a 1"),
  subjectId: z.string().min(1, "Selecciona una materia"),
  academicPeriodId: z.string().min(1, "Selecciona un período"),
  teacherId: z.string().min(1, "Selecciona un docente"),
});

const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Introduce una hora válida");

export const scheduleSchema = z
  .object({
    dayOfWeek: z.enum([
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ]),
    startTime: timeSchema,
    endTime: timeSchema,
  })
  .refine((values) => values.startTime < values.endTime, {
    message: "La hora final debe ser posterior al inicio",
    path: ["endTime"],
  });

export type GroupFormValues = z.infer<typeof groupSchema>;
export type ScheduleFormValues = z.infer<typeof scheduleSchema>;
