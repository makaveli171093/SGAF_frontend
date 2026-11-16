import { useRef, useState } from "react";
import { useAuthenticatedMutation } from "../../hooks/useAuthenticatedMutation";
import { saveOperation } from "../../services/operations";
import { useAuthStore } from "../../stores/authStore";
import { prepareAvatar } from "../../lib/avatar";
import Avatar from "../ui/Avatar";
export default function PhotoEditor() {
  const user = useAuthStore((state) => state.user);
  const [preview, setPreview] = useState<string | null>(null),
    [error, setError] = useState<string | null>(null),
    [processing, setProcessing] = useState(false);
  const generation = useRef(0);
  const mutation = useAuthenticatedMutation(
    async (token: string, avatarData: string | null) => {
      const response = await saveOperation(token, {
        path: "/account/avatar",
        values: { avatarData },
      });
      if (response.user && useAuthStore.getState().accessToken === token)
        useAuthStore.getState().setSession(token, response.user);
      return response;
    },
  );
  async function select(file?: File) {
    const current = ++generation.current;
    setError(null);
    setPreview(null);
    if (!file) return;
    setProcessing(true);
    try {
      const data = await prepareAvatar(file);
      if (current === generation.current) setPreview(data);
    } catch (error) {
      if (current === generation.current)
        setError(
          error instanceof Error
            ? error.message
            : "No se pudo abrir la imagen.",
        );
    } finally {
      if (current === generation.current) setProcessing(false);
    }
  }
  async function save(value: string | null) {
    if (await mutation.execute(value)) setPreview(null);
  }
  if (!user) return null;
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="mb-4 text-lg font-semibold text-brand">Foto de perfil</h2>
      <div className="flex flex-wrap items-center gap-4">
        <Avatar user={{ ...user, avatarData: preview ?? user.avatarData }} />
        <div>
          <label htmlFor="account-photo" className="block text-sm font-medium">
            Elegir foto
          </label>
          <input
            id="account-photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={mutation.isPending || processing}
            onChange={(event) => void select(event.target.files?.[0])}
            className="mt-2 block max-w-full text-sm"
          />
          <p className="mt-2 text-xs text-ink/70">
            JPEG, PNG o WebP, hasta 3 MB. Se recorta al centro y se guarda a 256
            × 256.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {preview && (
          <>
            <button
              className="btn-primary"
              disabled={mutation.isPending}
              onClick={() => void save(preview)}
            >
              Guardar foto
            </button>
            <button
              className="btn-secondary"
              disabled={mutation.isPending}
              onClick={() => setPreview(null)}
            >
              Descartar
            </button>
          </>
        )}
        {user.avatarData && (
          <button
            className="btn-secondary"
            disabled={mutation.isPending || processing}
            onClick={() => void save(null)}
          >
            Usar iniciales
          </button>
        )}
      </div>
      {processing && <p role="status">Preparando imagen…</p>}
      {(error || mutation.error) && (
        <p role="alert" className="mt-3 text-danger">
          {error ?? mutation.error}
        </p>
      )}
      {mutation.success && (
        <p role="status" className="mt-3 text-success">
          {mutation.success}
        </p>
      )}
    </div>
  );
}
