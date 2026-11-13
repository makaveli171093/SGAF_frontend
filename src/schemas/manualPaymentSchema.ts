import { z } from "zod";

export const manualPaymentSchema = z
  .object({
    method: z.enum(["CASH", "BANK_TRANSFER"]),
    receiptNumber: z.string().trim(),
  })
  .refine(
    (values) =>
      values.method !== "BANK_TRANSFER" || values.receiptNumber.length > 0,
    {
      message: "Introduce el número de comprobante de la transferencia",
      path: ["receiptNumber"],
    },
  );

export type ManualPaymentFormValues = z.infer<typeof manualPaymentSchema>;
