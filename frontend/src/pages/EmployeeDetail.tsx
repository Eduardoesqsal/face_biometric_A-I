import { useMemo } from "react";
import type { AttendanceRecord, Person } from "../domain/types";
import { Badge, Card } from "../shared/ui";
import { Icon } from "../shared/icons/Icon";
import { DonutChart } from "../features/employees/components/DonutChart";
import type { DataSource } from "../application/hooks/useLinkedData";

type EmployeeDetailPageProps = {
  personName: string;
  people: Person[];
  liveRecords: AttendanceRecord[];
  source: DataSource;
  onBack: () => void;
};

const SUMMARY_LABELS = [
  { label: "Presentes", color: "var(--brand)" },
  { label: "Ausentes", color: "var(--faint)" },
  { label: "Retardos", color: "var(--warning)" },
  { label: "Faltas", color: "var(--danger)" },
];

type DisplayRecord = { date: string; time: string; period: "AM" | "PM" };

function formatTimestamp(timestamp: string): DisplayRecord {
  const parts = timestamp.split(" ");
  const date = parts[0] ?? "";
  let rawTime = parts[1] ?? "00:00";
  rawTime = rawTime.length >= 5 ? rawTime.slice(0, 5) : rawTime;
  const [hh] = rawTime.split(":");
  const hour = Number(hh) || 0;
  const period: "AM" | "PM" = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return { date, time: `${displayHour}:${rawTime.split(":")[1]}`, period };
}

export function EmployeeDetailPage({
  personName,
  people,
  liveRecords,
  source,
  onBack,
}: EmployeeDetailPageProps) {
  const person = people.find((item) => item.name === personName);

  const personRecords = useMemo(() => {
    if (source !== "live") {
      return [];
    }
    return liveRecords
      .filter((record) => record.name === personName)
      .slice(0, 20)
      .reverse()
      .map((record) => ({ ...formatTimestamp(record.timestamp), timestamp: record.timestamp }));
  }, [personName, liveRecords, source]);

  if (!person) {
    return (
      <div className="fc-page">
        <Card className="fc-table-card">
          <div className="fc-empty" style={{ padding: 40 }}>
            Persona no encontrada.
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fc-page">
      <button className="fc-btn fc-btn--ghost fc-btn--sm" onClick={onBack} type="button">
        <Icon name="arrowLeft" />
        Volver a empleados
      </button>

      <Card className="fc-profile-card">
        <div className="fc-employee-card__photo-wrap">
          <img className="fc-employee-card__photo fc-employee-card__photo--lg" src={person.image_url} alt={person.name} />
        </div>
        <div className="fc-profile__info">
          <h2>{person.name}</h2>
          <div className="fc-profile__meta">
            <span className="fc-mono">Fotos registradas: {person.filename}</span>
            <span>Fuente: panel biométrico</span>
          </div>
        </div>
        <Badge tone="success">Activo</Badge>
      </Card>

      <div className="fc-detail-grid">
        <Card className="fc-info-card">
          <h3 className="fc-card-title">Información</h3>
          <div className="fc-info-list">
            <div className="fc-info-row">
              <span className="fc-info-row__label">Nombre</span>
              <span className="fc-info-row__value">{person.name}</span>
            </div>
            <div className="fc-info-row">
              <span className="fc-info-row__label">Imagen de referencia</span>
              <span className="fc-info-row__value fc-mono">{person.filename}</span>
            </div>
            <div className="fc-info-row">
              <span className="fc-info-row__label">Estado</span>
              <span className="fc-info-row__value">Activo</span>
            </div>
          </div>
        </Card>

        <Card className="fc-summary-card">
          <h3 className="fc-card-title">Resumen de asistencias</h3>
          <div className="fc-summary">
            <DonutChart
              segments={SUMMARY_LABELS.map((segment, index) => ({
                label: segment.label,
                color: segment.color,
                value: index === 0 ? personRecords.length : 0,
              }))}
            />
            <div className="fc-legend">
              {SUMMARY_LABELS.map((segment, index) => (
                <div className="fc-legend__item" key={segment.label}>
                  <span className="fc-legend__dot" style={{ background: segment.color }} />
                  <span>{segment.label}</span>
                  <strong>{index === 0 ? personRecords.length : 0}</strong>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card className="fc-table-card">
        <h3 className="fc-card-title">Registros reales de asistencia</h3>
        <div className="fc-table-scroll">
          <table className="fc-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Hora</th>
              </tr>
            </thead>
            <tbody>
              {personRecords.length ? (
                personRecords.map((record) => (
                  <tr key={`${record.timestamp}-${record.date}-${record.time}`}>
                    <td>{record.date}</td>
                    <td>
                      <Badge tone="success">Entrada</Badge>
                    </td>
                    <td>
                      {record.time} {record.period}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="fc-empty" colSpan={3}>
                    {source === "live"
                      ? "Esta persona aún no tiene registros de asistencia."
                      : "Conecta el backend para ver los registros reales."}
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
