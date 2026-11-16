import { useCallback } from "react";
import { useAuthenticatedQuery } from "../../hooks/useAuthenticatedQuery";
import { getHistory } from "../../services/operations";
export default function PeriodHistory({ id }: { id: string }) {
  const load = useCallback(
    (token: string, signal: AbortSignal) => getHistory(token, signal, id),
    [id],
  );
  const query = useAuthenticatedQuery(load);
  return (
    <div className="mt-4 text-sm">
      {query.isLoading && <p role="status">Consultando historial…</p>}
      {query.error && (
        <p role="alert">
          {query.error} <button onClick={query.reload}>Reintentar</button>
        </p>
      )}
      {query.data &&
        (query.data.events.length ? (
          <ol className="space-y-4">
            {query.data.events.map((event) => (
              <li key={event.id} className="border-l-2 border-accent pl-3">
                <p>{event.detail}</p>
                <p className="mt-1 text-ink/70">
                  {event.actor
                    ? `${event.actor.firstName} ${event.actor.lastName}`
                    : "Administrador"}{" "}
                  ·{" "}
                  {new Date(event.createdAt).toLocaleString("es-BO", {
                    timeZone: "America/La_Paz",
                  })}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p>No hay reaperturas registradas.</p>
        ))}
    </div>
  );
}
