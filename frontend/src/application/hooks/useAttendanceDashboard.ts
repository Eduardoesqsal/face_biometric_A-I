import { useEffect, useState } from "react";
import type { AttendanceRecord, DashboardSummary } from "../../domain/types";
import { deleteAttendance, getAttendance } from "../../infrastructure/api/attendanceApi";

export function useAttendanceDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAttendance();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar la asistencia");
    } finally {
      setLoading(false);
    }
  }

  function addLiveRecord(record: AttendanceRecord) {
    setSummary((current) => {
      if (!current || current.records.some((item) => item.name === record.name && item.timestamp === record.timestamp)) {
        return current;
      }

      return {
        ...current,
        records: [record, ...current.records],
        today: current.today + 1,
      };
    });
  }

  async function removeRecord(record: AttendanceRecord) {
    const previous = summary;
    setSummary((current) =>
      current
        ? {
            ...current,
            records: current.records.filter(
              (item) => !(item.name === record.name && item.timestamp === record.timestamp),
            ),
            today: record.timestamp.startsWith(new Date().toISOString().slice(0, 10))
              ? Math.max(0, current.today - 1)
              : current.today,
          }
        : current,
    );

    try {
      await deleteAttendance({ name: record.name, timestamp: record.timestamp });
    } catch (err) {
      setSummary(previous);
      throw err;
    }
  }

  async function clearRecords() {
    const previous = summary;
    setSummary((current) => (current ? { ...current, records: [], today: 0 } : current));

    try {
      await deleteAttendance({ all: true });
    } catch (err) {
      setSummary(previous);
      throw err;
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  return {
    summary,
    loading,
    error,
    refresh,
    addLiveRecord,
    removeRecord,
    clearRecords,
  };
}
