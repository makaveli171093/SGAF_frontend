import { z } from "zod";

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

export const staffSchema = z
  .object({
    firstName: z.string().trim().min(1, "Introduce los nombres"),
    lastName: z.string().trim().min(1, "Introduce los apellidos"),
    ci: z
      .string()
      .trim()
      .min(5, "El documento debe tener al menos 5 caracteres")
      .max(20, "El documento admite hasta 20 caracteres"),
    phone: z.string().trim(),
    email: z.string().trim().pipe(z.email("Introduce un correo válido")),
    password: z.string().min(8, "Usa al menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirma la contraseña"),
    role: z.enum(["ADMIN", "RECEPCIONIST", "TEACHER"]),
    specialty: z.string().trim(),
    hireDate: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
  .refine(
    (values) => values.role !== "TEACHER" || values.specialty.length > 0,
    {
      message: "Introduce la especialidad del docente",
      path: ["specialty"],
    },
  )
  .refine(
    (values) => values.role !== "TEACHER" || isValidDate(values.hireDate),
    {
      message: "Selecciona una fecha de contratación válida",
      path: ["hireDate"],
    },
  );

export type StaffFormValues = z.infer<typeof staffSchema>;
