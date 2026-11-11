import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <section className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center">
        <p className="text-sm font-semibold text-brand">SGAF · 404</p>

        <h1 className="mt-3 text-2xl font-semibold text-brand">
          Página no encontrada
        </h1>

        <p className="mt-4">
          La dirección que abriste no corresponde a una página de SGAF.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-lg bg-brand px-4 py-3 font-medium text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}
