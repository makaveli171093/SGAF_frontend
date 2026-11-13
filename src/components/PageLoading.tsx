export default function PageLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-48 items-center justify-center p-8"
    >
      <div className="text-center">
        <p className="font-semibold text-brand">NEXORA</p>
        <p className="mt-2 text-sm text-ink/70">Cargando página…</p>
      </div>
    </div>
  );
}
