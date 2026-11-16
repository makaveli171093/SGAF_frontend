export default function Pagination({
  page,
  total,
  onChange,
  size = 12,
}: {
  page: number;
  total: number;
  onChange: (value: number) => void;
  size?: number;
}) {
  const pages = Math.max(1, Math.ceil(total / size));
  return (
    <nav
      aria-label="Paginación"
      className="my-5 flex flex-wrap items-center justify-between gap-3"
    >
      <p className="text-sm text-ink/70">
        {total} resultados · Página {page} de {pages}
      </p>
      <div className="flex gap-2">
        <button
          className="btn-secondary"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          Anterior
        </button>
        <button
          className="btn-secondary"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
        >
          Siguiente
        </button>
      </div>
    </nav>
  );
}
