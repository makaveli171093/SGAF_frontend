import { z } from "zod";

function isValidWebUrl(value: string): boolean {
  if (!value) return true;

  try {
    const url = new URL(value);

    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export const submissionSchema = z
  .object({
    textContent: z.string().trim(),
    fileUrl: z
      .string()
      .trim()
      .refine(isValidWebUrl, "Introduce un enlace HTTP o HTTPS válido"),
  })
  .refine((values) => Boolean(values.textContent || values.fileUrl), {
    message: "Escribe una respuesta o proporciona un enlace",
    path: ["textContent"],
  });

export type SubmissionFormValues = z.infer<typeof submissionSchema>;
