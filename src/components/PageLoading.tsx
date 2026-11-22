import { Spinner } from "./ui/Loading";

export default function PageLoading({ label = "Cargando NEXORA…" }: { label?: string }) {
  return (
    <div role="status" className="flex min-h-48 flex-col items-center justify-center gap-4 p-8 text-brand">
      <Spinner branded />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
