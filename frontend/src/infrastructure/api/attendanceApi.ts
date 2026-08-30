import type { DashboardSummary, DeleteAttendanceRequest, MessageResponse } from "../../domain/types";
import { requestJson } from "./http";

export function getAttendance(): Promise<DashboardSummary> {
  return requestJson<DashboardSummary>("/api/attendance");
}

export function deleteAttendance(payload: DeleteAttendanceRequest): Promise<MessageResponse> {
  return requestJson<MessageResponse>("/api/attendance", {
    method: "DELETE",
    body: JSON.stringify(payload),
  });
}

