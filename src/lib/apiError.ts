import axios from "axios";

interface ApiErrorResponse {
  message?: string | string[];
}

export function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return "Ocurrió un error inesperado. Intenta nuevamente.";
  }

  if (error.code === "ECONNABORTED") {
    return "El servidor tardó demasiado en responder. Intenta nuevamente.";
  }

  if (!error.response) {
    return "No pudimos conectar con el servidor. Revisa tu conexión.";
  }

  if (error.response.status >= 500) {
    return "El servidor no pudo completar la solicitud. Intenta nuevamente.";
  }

  const message = error.response.data?.message;

  if (typeof message === "string") {
    return message;
  }

  if (Array.isArray(message)) {
    const messages = message.filter(
      (item): item is string => typeof item === "string",
    );

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  return "No se pudo completar la solicitud.";
}
