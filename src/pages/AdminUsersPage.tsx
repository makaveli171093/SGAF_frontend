import { useState } from "react";
import { roleLabels, statusLabels } from "../constants/authLabels";
import { useAuthenticatedQuery } from "../hooks/useAuthenticatedQuery";
import { usersService } from "../services/users";

function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading, error, reload } = useAuthenticatedQuery(
    usersService.getAll,
  );

  const query = normalizeSearch(search);

  const filteredUsers =
    data?.users.filter((user) => {
      const searchableText = [
        user.firstName,
        user.lastName,
        user.email,
        user.ci,
        user.stundentProfile?.enrollmentCode ?? "",
      ].join(" ");

      const matchesSearch = normalizeSearch(searchableText).includes(query);

      const matchesRole = !roleFilter || user.role === roleFilter;
      const matchesStatus = !statusFilter || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    }) ?? [];

  function clearFilters() {
    setSearch("");
    setRoleFilter("");
    setStatusFilter("");
  }

  const fieldClass =
    "mt-2 w-full rounded-lg border border-border bg-surface p-3 focus:border-brand focus:outline-2 focus:outline-brand";

  return (
    <section aria-labelledby="users-title">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            id="users-title"
            className="text-2xl font-bold text-brand sm:text-3xl"
          >
            Usuarios
          </h1>

          <p className="mt-2 text-ink/70">
            Consulta las cuentas registradas, sus roles y estados.
          </p>
        </div>

        <button
          type="button"
          onClick={reload}
          disabled={isLoading}
          className="rounded-lg border border-brand px-4 py-2 font-medium text-brand hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
        >
          {isLoading ? "Cargando…" : "Actualizar"}
        </button>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-surface p-5">
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <label htmlFor="user-search" className="text-sm font-medium">
              Buscar usuario
            </label>

            <input
              id="user-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-describedby="user-search-help"
              className={fieldClass}
            />

            <p id="user-search-help" className="mt-1 text-xs text-ink/70">
              Nombre, correo, documento o matrícula.
            </p>
          </div>

          <div>
            <label htmlFor="role-filter" className="text-sm font-medium">
              Rol
            </label>

            <select
              id="role-filter"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className={fieldClass}
            >
              <option value="">Todos los roles</option>

              {Object.entries(roleLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status-filter" className="text-sm font-medium">
              Estado
            </label>

            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className={fieldClass}
            >
              <option value="">Todos los estados</option>

              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="mt-4 rounded font-medium text-brand underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Limpiar filtros
        </button>
      </div>

      {isLoading && (
        <p
          role="status"
          className="rounded-xl border border-border bg-surface p-6"
        >
          Consultando los usuarios…
        </p>
      )}

      {error && (
        <div role="alert" className="rounded-xl bg-danger-soft p-6 text-danger">
          <p>{error}</p>

          <button
            type="button"
            onClick={reload}
            className="mt-3 rounded-lg border border-current px-4 py-2"
          >
            Reintentar
          </button>
        </div>
      )}

      {data && (
        <>
          <p role="status" className="mb-4 text-sm text-ink/70">
            Mostrando {filteredUsers.length} de {data.users.length} usuarios
          </p>

          {data.users.length === 0 ? (
            <p className="rounded-xl border border-border bg-surface p-6">
              No hay usuarios registrados.
            </p>
          ) : filteredUsers.length === 0 ? (
            <p className="rounded-xl border border-border bg-surface p-6">
              No hay usuarios que coincidan con los filtros.
            </p>
          ) : (
            <div className="grid gap-5 xl:grid-cols-2">
              {filteredUsers.map((user) => (
                <article
                  key={user.id}
                  className="min-w-0 rounded-2xl border border-border bg-surface p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h2 className="min-w-0 break-words text-xl font-semibold text-brand">
                      {user.firstName} {user.lastName}
                    </h2>

                    <span className="rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-brand">
                      {roleLabels[user.role]}
                    </span>
                  </div>

                  <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="min-w-0">
                      <dt className="text-sm text-ink/70">Correo</dt>
                      <dd className="mt-1 break-words font-medium">
                        {user.email}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm text-ink/70">Documento</dt>
                      <dd className="mt-1 break-words font-medium">
                        {user.ci}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm text-ink/70">Teléfono</dt>
                      <dd className="mt-1 font-medium">
                        {user.phone || "No registrado"}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm text-ink/70">Estado</dt>
                      <dd className="mt-1 font-medium">
                        {statusLabels[user.status]}
                      </dd>
                    </div>

                    {user.stundentProfile && (
                      <div>
                        <dt className="text-sm text-ink/70">Matrícula</dt>
                        <dd className="mt-1 break-words font-medium">
                          {user.stundentProfile.enrollmentCode}
                        </dd>
                      </div>
                    )}

                    {user.teacherProfile && (
                      <div>
                        <dt className="text-sm text-ink/70">Especialidad</dt>
                        <dd className="mt-1 break-words font-medium">
                          {user.teacherProfile.specialty}
                        </dd>
                      </div>
                    )}
                  </dl>
                </article>
              ))}
            </div>
          )}

          <p className="mt-5 text-sm text-ink/70">
            Los estados corresponden a los registros devueltos en la última
            consulta.
          </p>
        </>
      )}
    </section>
  );
}
