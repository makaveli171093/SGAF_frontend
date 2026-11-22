import { createContext, useContext } from "react";

export type ToastKind = "success" | "error";
export const ToastContext = createContext<(kind: ToastKind, message: string) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}
