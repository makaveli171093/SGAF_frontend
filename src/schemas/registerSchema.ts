import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "Introduce tus nombres"),
    lastName: z.string().trim().min(1, "Introduce tus apellidos"),
    ci: z
      .string()
      .trim()
      .min(5, "El documento debe tener al menos 5 caracteres")
      .max(20, "El documento admite hasta 20 caracteres"),
    phone: z.string().trim(),
    email: z.string().trim().pipe(z.email("Introduce un correo válido")),
    password: z.string().min(8, "Usa al menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
    guardianName: z
      .string()
      .trim()
      .min(1, "Introduce el nombre del tutor o responsable"),
    guardianPhone: z
      .string()
      .trim()
      .min(1, "Introduce el teléfono del tutor o responsable"),
    guardianCi: z.string().trim(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
