import { useCallback, useState, type FormEvent } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuthenticatedQuery } from "../hooks/useAuthenticatedQuery";
import { getMetrics } from "../services/operations";
import { formatAmount } from "../lib/finance";
import { downloadCsv } from "../lib/report";

export default function ReportsPage() {
  const [filters, setFilters] = useState<{ from?: string; to?: string }>({});
  const load = useCallback(
    (token: string, signal: AbortSignal) => getMetrics(token, signal, filters),
    [filters],
  );
  const { data, error, isLoading, reload } = useAuthenticatedQuery(load);
  function filter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setFilters({
      from: String(form.get("from")) || undefined,
      to: String(form.get("to")) || undefined,
    });
  }
  function exportReport() {
    if (!data) return;
    downloadCsv(`nexora-reporte-${data.filters.from}-${data.filters.to}.csv`, [
      ["NEXORA · Reporte académico y financiero"],
      ["Generado", data.generatedAt],
      ["Zona horaria", data.filters.timezone],
      ["Desde", data.filters.from],
      ["Hasta", data.filters.to],
      [
        "Criterio",
        "Pagos aprobados por fecha de verificación; los indicadores de deuda y grupos son el estado actual.",
      ],
      ["Ingresos aprobados Bs", data.revenue],
      ["Pagos aprobados", data.approvedPayments],
      ["Pagos aprobados sin fecha (excluidos)", data.undatedApproved],
      ["Saldo pendiente actual Bs", data.snapshot.outstandingAmount],
      ["Saldo vencido actual Bs", data.snapshot.overdueAmount],
      [],
      ["Mes", "Ingresos aprobados Bs"],
      ...data.monthlyRevenue.map((m) => [m.month, m.amount]),
      [],
      [
        "Grupo",
        "Materia",
        "Periodo",
        "Estado del periodo",
        "Inscritos activos",
        "Capacidad",
      ],
      ...data.groups.map((g) => [
        g.name,
        g.subject,
        g.period,
        g.status,
        g.enrolled,
        g.capacity,
      ]),
    ]);
  }
  return (
    <section>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand">Métricas y reportes</h1>
          <p className="mt-2 text-ink/70">
            Ingresos verificados y situación académica actual.
          </p>
        </div>
        <button className="btn-secondary" disabled={isLoading} onClick={reload}>
          Actualizar
        </button>
      </div>
      <form
        onSubmit={filter}
        className="report-filters mb-6 flex flex-wrap items-end gap-4 rounded-2xl border border-border bg-surface p-5"
      >
        <label className="text-sm font-medium">
          Desde
          <input name="from" type="date" className="form-field" />
        </label>
        <label className="text-sm font-medium">
          Hasta
          <input name="to" type="date" className="form-field" />
        </label>
        <button className="btn-primary" disabled={isLoading}>
          Aplicar fechas
        </button>
        <p className="w-full text-xs text-ink/70">
          Hasta un año por consulta. Sin fechas: año actual. Hora de Bolivia.
        </p>
      </form>
      {isLoading && <p role="status">Preparando reporte…</p>}
      {error && (
        <p role="alert" className="rounded-xl bg-danger-soft p-5 text-danger">
          {error}
        </p>
      )}
      {data && (
        <>
          <p className="mb-4 text-sm text-ink/70">
            Del {data.filters.from} al {data.filters.to} · Generado{" "}
            {new Date(data.generatedAt).toLocaleString("es-BO", {
              timeZone: "America/La_Paz",
            })}{" "}
            (Bolivia)
          </p>
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Ingresos del rango", formatAmount(data.revenue)],
              ["Pagos aprobados del rango", data.approvedPayments],
              [
                "Saldo pendiente actual",
                formatAmount(data.snapshot.outstandingAmount),
              ],
              [
                "Saldo vencido actual",
                formatAmount(data.snapshot.overdueAmount),
              ],
            ].map(([label, value]) => (
              <article
                key={label}
                className="report-stat rounded-2xl border border-border bg-surface p-5"
              >
                <p className="text-sm text-ink/70">{label}</p>
                <p className="mt-3 text-2xl font-bold text-brand">{value}</p>
              </article>
            ))}
          </div>
          <p className="mb-5 text-sm text-ink/70">
            Ingresos: únicamente pagos aprobados, según su fecha de
            verificación. Deudas, usuarios y grupos: estado al generar el
            reporte, sin filtro de fechas.
          </p>
          {data.undatedApproved > 0 && (
            <p
              role="status"
              className="mb-5 rounded-lg bg-warning-soft p-4 text-warning"
            >
              Hay {data.undatedApproved} pagos aprobados antiguos sin fecha de
              verificación. Se excluyen del cálculo por fechas.
            </p>
          )}
          <article className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="mb-5 text-lg font-semibold text-brand">
              Ingresos aprobados por mes · Bs
            </h2>
            {data.approvedPayments === 0 && (
              <p className="mb-4 text-sm">
                No hay pagos aprobados con fecha de verificación en este rango.
              </p>
            )}
            <div
              className="h-72 w-full min-w-0"
              role="img"
              aria-label="Gráfico de ingresos mensuales. Los mismos importes están disponibles en la tabla inferior."
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyRevenue}>
                  <CartesianGrid
                    stroke="#e3e9f2"
                    strokeDasharray="4 4"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={12}
                  />
                  <YAxis axisLine={false} tickLine={false} tickMargin={10} />
                  <Tooltip />
                  <Bar
                    dataKey="amount"
                    name="Ingresos Bs"
                    fill="#3155d9"
                    radius={[7, 7, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <details className="mt-5">
              <summary className="cursor-pointer text-sm font-semibold text-brand">
                Ver importes por mes
              </summary>
              <table className="mt-3 w-full text-left text-sm">
                <caption className="sr-only">
                  Ingresos aprobados mensuales
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Mes</th>
                    <th scope="col">Importe</th>
                  </tr>
                </thead>
                <tbody>
                  {data.monthlyRevenue.map((m) => (
                    <tr key={m.month}>
                      <th scope="row" className="py-2 font-normal">
                        {m.month}
                      </th>
                      <td>{formatAmount(m.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          </article>
          <div className="my-6 grid gap-4 sm:grid-cols-3">
            {[
              ["Usuarios activos", data.snapshot.activeUsers],
              ["Postulantes por aprobar", data.snapshot.applicants],
              ["Pagos pendientes", data.snapshot.pendingPayments],
            ].map(([label, value]) => (
              <article
                key={label}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <p className="text-sm text-ink/70">{label}</p>
                <p className="mt-2 text-2xl font-bold text-brand">{value}</p>
              </article>
            ))}
          </div>
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-left text-sm">
              <caption className="p-5 text-left text-lg font-semibold text-brand">
                Ocupación actual de grupos
              </caption>
              <thead className="bg-canvas">
                <tr>
                  {[
                    "Materia / Grupo",
                    "Periodo",
                    "Estado",
                    "Inscritos",
                    "Capacidad",
                  ].map((h) => (
                    <th key={h} scope="col" className="p-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.groups.map((g) => (
                  <tr key={g.id} className="border-t border-border">
                    <th scope="row" className="p-3 font-medium">
                      {g.subject} · {g.name}
                    </th>
                    <td className="p-3">{g.period}</td>
                    <td className="p-3">
                      {{
                        ACTIVE: "Activo",
                        PLANNED: "Planificado",
                        CLOSED: "Cerrado",
                      }[g.status] ?? g.status}
                    </td>
                    <td className="p-3">{g.enrolled}</td>
                    <td className="p-3">{g.capacity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.groups.length === 0 && (
              <p className="p-5">No hay grupos registrados.</p>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn-primary" onClick={exportReport}>
              Descargar CSV
            </button>
            <button className="btn-secondary" onClick={() => window.print()}>
              Imprimir / guardar PDF
            </button>
          </div>
        </>
      )}
    </section>
  );
}
