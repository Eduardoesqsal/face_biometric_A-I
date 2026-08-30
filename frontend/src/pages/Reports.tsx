import { useState } from "react";
import { Card } from "../shared/ui";
import { Icon } from "../shared/icons/Icon";

const REPORT_TYPES = [
  "Reporte de asistencia",
  "Reporte por empleado",
  "Reporte por fecha",
  "Reporte de retardos",
  "Reporte de faltas",
];

export function ReportsPage() {
  const [type, setType] = useState(REPORT_TYPES[0]);
  const [generated, setGenerated] = useState(false);

  return (
    <div className="fc-page">
      <div className="fc-reports-layout">
        <Card className="fc-form-card">
          <h2 className="fc-card-title">Generar reporte</h2>
          <p className="fc-card-desc">Elige el tipo y configura los filtros.</p>

          <div className="fc-report-type">
            {REPORT_TYPES.map((option) => (
              <button
                key={option}
                className={`fc-report-option ${type === option ? "fc-report-option--active" : ""}`}
                onClick={() => {
                  setType(option);
                  setGenerated(false);
                }}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>

          <div className="fc-field-row">
            <label className="fc-field">
              <span>Desde</span>
              <input type="date" />
            </label>
            <label className="fc-field">
              <span>Hasta</span>
              <input type="date" />
            </label>
          </div>

          <label className="fc-field">
            <span>Estado</span>
            <select defaultValue="">
              <option value="" disabled>
                Todos
              </option>
              <option>A tiempo</option>
              <option>Retardo</option>
              <option>Falta</option>
            </select>
          </label>

          <div className="fc-actions">
            <button
              className="fc-btn fc-btn--primary"
              onClick={() => setGenerated(true)}
              type="button"
            >
              <Icon name="reports" />
              Generar reporte
            </button>
            <button
              className="fc-btn fc-btn--secondary"
              onClick={() => setGenerated(true)}
              type="button"
            >
              <Icon name="download" />
              Exportar
            </button>
          </div>

          {generated ? (
            <div className="fc-alert fc-alert--success">
              Reporte generado. La exportación se conectará al backend cuando esté disponible.
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
