import { useEffect, useRef, useState, type ReactNode } from "react";
import { ConfirmationContext } from "../../lib/confirmation";
import Modal from "./Modal";

export default function ConfirmationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const resolver = useRef<((answer: boolean) => void) | null>(null);
  useEffect(
    () => () => {
      resolver.current?.(false);
    },
    [],
  );
  function confirm(text: string) {
    if (resolver.current) return Promise.resolve(false);
    setMessage(text);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }
  function answer(value: boolean) {
    resolver.current?.(value);
    resolver.current = null;
    setMessage(null);
  }
  return (
    <ConfirmationContext value={confirm}>
      {children}
      {message !== null && (
        <Modal title="Confirmar operación" onClose={() => answer(false)}>
          <p className="whitespace-pre-line leading-relaxed">{message}</p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              autoFocus
              className="btn-secondary"
              onClick={() => answer(false)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => answer(true)}
            >
              Confirmar
            </button>
          </div>
        </Modal>
      )}
    </ConfirmationContext>
  );
}
