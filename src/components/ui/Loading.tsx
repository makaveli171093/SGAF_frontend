import NexoraLogo from "../brand/NexoraLogo";

export function Spinner({ branded = false }: { branded?: boolean }) {
  return (
    <span aria-hidden="true" className={branded ? "relative inline-grid place-items-center p-3" : "inline-flex"}>
      {branded && <NexoraLogo markOnly />}
      <span className={`${branded ? "absolute inset-0 border-2" : "size-4 border-2"} rounded-full border-current border-r-transparent motion-safe:animate-spin`} />
    </span>
  );
}

export function ListSkeleton({ label }: { label: string }) {
  return (
    <div role="status" className="space-y-4">
      <span className="sr-only">{label}</span>
      {[0, 1, 2].map((row) => (
        <div key={row} aria-hidden="true" className="space-y-3 rounded-2xl border border-border bg-surface p-6 motion-safe:animate-pulse">
          <div className="h-3 w-1/3 rounded bg-border" />
          <div className="h-5 w-2/3 rounded bg-border" />
          <div className="h-3 w-full rounded bg-border" />
        </div>
      ))}
    </div>
  );
}

export function RefreshButton({ busy, onClick }: { busy: boolean; onClick: () => void }) {
  return (
    <>
      <button type="button" className="btn-secondary inline-flex items-center gap-2" onClick={onClick} disabled={busy}>
        {busy && <Spinner />}
        {busy ? "Actualizando…" : "Actualizar"}
      </button>
      <span role="status" className="sr-only">{busy ? "Actualizando…" : ""}</span>
    </>
  );
}
