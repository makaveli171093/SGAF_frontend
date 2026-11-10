import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error("VITE_API_URL no esta configurada.");
}

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 60000, // 60 segundos
});
