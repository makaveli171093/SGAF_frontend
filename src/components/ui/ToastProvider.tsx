import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { ToastContext, type ToastKind } from "../../lib/toast";
type Toast = { id: number; kind: ToastKind; message: string };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, number>());

  const dismiss = useCallback((id: number) => {
    window.clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback((kind: ToastKind, message: string) => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, kind, message }]);
    if (kind === "success") timers.current.set(id, window.setTimeout(() => dismiss(id), 7000));
  }, [dismiss]);

  useEffect(() => {
    const pendingTimers = timers.current;
    return () => pendingTimers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="pointer-events-none fixed inset-x-3 bottom-3 z-40 grid max-h-[50dvh] gap-2 overflow-y-auto sm:left-auto sm:w-96">
        {toasts.map(({ id, kind, message }) => (
          <div key={id} className={`pointer-events-auto flex items-start gap-3 rounded-xl border border-current p-3 shadow-lg ${kind === "success" ? "bg-success-soft text-success" : "bg-danger-soft text-danger"}`}>
            <p role={kind === "success" ? "status" : "alert"} className="flex-1 wrap-break-word">{message}</p>
            <button type="button" aria-label="Cerrar aviso" onClick={() => dismiss(id)} className="rounded px-2 font-bold focus-visible:outline-2">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
