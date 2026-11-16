import { useEffect, useId, useRef, type ReactNode } from "react";

export default function Modal({
  title,
  children,
  onClose,
  busy = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  busy?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (previous instanceof HTMLElement && previous.isConnected)
        previous.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={id}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      className="m-auto max-h-[90dvh] w-[min(94vw,640px)] overflow-y-auto rounded-2xl border border-border bg-surface p-6 text-ink shadow-xl backdrop:bg-black/45"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 id={id} className="text-xl font-bold text-brand">
          {title}
        </h2>
        <button
          type="button"
          aria-label="Cerrar diálogo"
          disabled={busy}
          onClick={onClose}
          className="rounded-lg border border-border px-3 py-2"
        >
          ✕
        </button>
      </div>
      {children}
    </dialog>
  );
}
