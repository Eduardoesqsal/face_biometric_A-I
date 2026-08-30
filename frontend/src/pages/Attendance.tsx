import { useMemo, useState } from "react";
import type { AttendanceRecord } from "../domain/types";
import { Avatar, Badge, Card } from "../shared/ui";
import { Icon } from "../shared/icons/Icon";
import type { DataSource } from "../application/hooks/useLinkedData";

type AttendancePageProps = {
  liveRecords: AttendanceRecord[];
  source: DataSource;
  onDelete: (record: AttendanceRecord) => void;
  onClear: () => void;
};

type DisplayRow = {
  id: string;
  name: string;
  time: string;
  timestamp: string;
};

function parseTimestamp(timestamp: string): { date: string; time: string } {
  const parts = timestamp.split(" ");
  const date = parts[0] ?? "";
  const rawTime = parts[1] ?? "";
  const [hh, mm] = rawTime.split(":");
  const hour = Number(hh) || 0;
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const time = `${displayHour}:${mm} ${period}`;
  return { date, time };
}

function toDisplayRow(record: AttendanceRecord): DisplayRow {
  const { time } = parseTimestamp(record.timestamp);
  return {
    id: `${record.name}-${record.timestamp}`,
    name: record.name,
    time,
    timestamp: record.timestamp,
  };
}

export function AttendancePage({ liveRecords, source, onDelete, onClear }: AttendancePageProps) {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState(getToday());

  const rows = useMemo<DisplayRow[]>(() => liveRecords.slice().reverse().map(toDisplayRow), [liveRecords]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => (q ? row.name.toLowerCase().includes(q) : true));
  }, [rows, query]);

  return (
    <div className="fc-page">
      <div className="fc-source-banner">
        <span className={`fc-source-pill fc-source-pill--${source === "live" ? "live" : "mock"}`}>
          <i />
          {source === "live" ? "Registros reales del backend" : "Vista de demostración (datos simulados)"}
        </span>
      </div>

      <Card className="fc-toolbar-card">
        <div className="fc-toolbar">
          <label className="fc-search">
            <Icon name="search" className="fc-search__icon" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar empleado..."
              aria-label="Buscar empleado"
            />
          </label>

          <label className="fc-date-field">
            <span>Fecha</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              aria-label="Seleccionar fecha"
            />
          </label>

          <button className="fc-btn fc-btn--danger" onClick={onClear} type="button">
            <Icon name="trash" />
            Eliminar todas
          </button>
        </div>
      </Card>

      <Card className="fc-table-card">
        <div className="fc-table-scroll">
          <table className="fc-table">
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Tipo</th>
                <th>Hora</th>
                <th className="fc-u-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <div className="fc-cell-name">
                        <Avatar name={record.name} size="sm" />
                        <span>{record.name}</span>
                      </div>
                    </td>
                    <td>
                      <Badge tone="success">Entrada</Badge>
                    </td>
                    <td>{record.time}</td>
                    <td className="fc-u-right">
                      <button
                        className="fc-btn fc-btn--ghost fc-btn--sm"
                        onClick={() => onDelete({ name: record.name, timestamp: record.timestamp })}
                        type="button"
                      >
                        <Icon name="trash" />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="fc-empty" colSpan={4}>
                    Aún no hay registros de asistencia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}
