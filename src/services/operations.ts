import { api } from "../lib/axios";
import type { User } from "../types/auth";
export type EditValues = Record<string, string | number | boolean | null>;
export async function saveOperation(
  token: string,
  input: {
    path: string;
    values: EditValues;
    method?: "patch" | "post" | "delete";
  },
) {
  return (
    await api.request<{ message: string; user?: User }>({
      url: input.path,
      method: input.method ?? "patch",
      data: input.values,
      headers: { Authorization: `Bearer ${token}` },
    })
  ).data;
}
export interface AuditHistory {
  events: {
    id: string;
    action: string;
    detail: string;
    createdAt: string;
    actor: { firstName: string; lastName: string } | null;
  }[];
}
export async function getHistory(
  token: string,
  signal: AbortSignal,
  id: string,
) {
  return (
    await api.get<AuditHistory>(`/management/periods/${id}/history`, {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    })
  ).data;
}
export interface Metrics {
  generatedAt: string;
  filters: { from: string; to: string; timezone: string };
  revenue: number;
  approvedPayments: number;
  undatedApproved: number;
  monthlyRevenue: { month: string; amount: number }[];
  snapshot: {
    activeUsers: number;
    applicants: number;
    pendingPayments: number;
    outstandingAmount: number;
    overdueAmount: number;
  };
  groups: {
    id: string;
    name: string;
    subject: string;
    period: string;
    status: string;
    capacity: number;
    enrolled: number;
  }[];
}
export async function getMetrics(
  token: string,
  signal: AbortSignal,
  filters: { from?: string; to?: string } = {},
) {
  return (
    await api.get<Metrics>("/management/metrics", {
      headers: { Authorization: `Bearer ${token}` },
      signal,
      params: filters,
    })
  ).data;
}
