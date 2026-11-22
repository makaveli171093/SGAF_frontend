import { useState } from "react";
import { assignmentPage, assignmentPageSize, defaultAssignmentFilters, filterAssignments } from "../../lib/assignmentLists";
import type { StudentAssignment, TeacherAssignment } from "../../types/assignments";
import Pagination from "../ui/Pagination";

export const filterField = "w-full rounded-lg border border-border bg-surface px-3 py-2 focus-visible:outline-2 focus-visible:outline-brand";

export function useAssignmentList<T extends StudentAssignment | TeacherAssignment>(
  assignments: T[], now: number, student = false,
) {
  const [filters, setFilters] = useState(defaultAssignmentFilters);
  const [requestedPage, setPage] = useState(1);
  const filtered = filterAssignments(assignments, filters, now);
  const { page, items } = assignmentPage(filtered, requestedPage);
  const subjects = [...new Map(assignments.map(({ group }) => [group.subject.code, group.subject.name]))]
    .sort(([, left], [, right]) => left.localeCompare(right, "es"));

  function changeFilter(key: keyof typeof filters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  const controls = (
    <fieldset className="mb-4 grid min-w-0 gap-3 rounded-xl border border-border p-4 sm:grid-cols-2 xl:grid-cols-4">
      <legend className="px-2 font-semibold text-brand">Filtrar tareas</legend>
      <label className="text-sm">Buscar tareas
        <input type="search" className={filterField} value={filters.query} onChange={(event) => changeFilter("query", event.target.value)} />
      </label>
      <label className="text-sm">Materia
        <select className={filterField} value={filters.subject} onChange={(event) => changeFilter("subject", event.target.value)}>
          <option value="">Todas</option>
          {subjects.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
        </select>
      </label>
      <label className="text-sm">Estado
        <select className={filterField} value={filters.status} onChange={(event) => changeFilter("status", event.target.value)}>
          <option value="">Todos</option>
          <option value="open">{student ? "Pendiente de entrega" : "Plazo abierto"}</option>
          <option value="closed">{student ? "Vencida sin entrega" : "Plazo finalizado"}</option>
          {student && <option value="pending">Entregada por calificar</option>}
          {student && <option value="graded">Calificada</option>}
        </select>
      </label>
      <label className="text-sm">Ordenar por
        <select className={filterField} value={filters.sort} onChange={(event) => changeFilter("sort", event.target.value)}>
          <option value="soonest">Fecha límite ascendente</option>
          <option value="latest">Fecha límite descendente</option>
          <option value="title">Título</option>
        </select>
      </label>
    </fieldset>
  );
  const pagination = filtered.length > 0 && (
    <Pagination page={page} size={assignmentPageSize} total={filtered.length} onChange={setPage} />
  );

  return { items, controls, pagination };
}
