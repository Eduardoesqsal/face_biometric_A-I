import type { AttendanceChartPoint, AttendanceRecord, PageId } from "../domain/types";
import { Icon } from "../shared/icons/Icon";
import { Card } from "../shared/ui";
import { AttendanceChart } from "../features/dashboard/components/AttendanceChart";
import { StatCard } from "../features/dashboard/components/StatCard";
import { RecentRecords } from "../features/dashboard/components/RecentRecords";
import type { DataSource } from "../application/hooks/useLinkedData";

type DashboardPageProps = {
  onNavigate: (page: PageId) => void;
  presentToday: number;
  registeredPeople: number;
  records: AttendanceRecord[];
  source: DataSource;
};

const TRAVEL_TIMES = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"];

function buildChartData(records: AttendanceRecord[], todayISO: string): AttendanceChartPoint[] {
  const counts = new Map<string, number>([...TRAVEL_TIMES.map((t) => [t, 0] as const)]);

  records.forEach((record) => {
    const [date, rawTime] = record.timestamp.split(" ");
    if (date !== todayISO || !rawTime) {
      return;
    }
    const [hh] = rawTime.split(":");
    const hour = Number(hh) || 0;

    if (hour < 4) {
      counts.set("00:00", (counts.get("00:00") ?? 0) + 1);
    } else if (hour < 8) {
      counts.set("04:00", (counts.get("04:00") ?? 0) + 1);
    } else if (hour < 12) {
      counts.set("08:00", (counts.get("08:00") ?? 0) + 1);
    } else if (hour < 16) {
      counts.set("12:00", (counts.get("12:00") ?? 0) + 1);
    } else if (hour < 20) {
      counts.set("16:00", (counts.get("16:00") ?? 0) + 1);
    } else {
      counts.set("20:00", (counts.get("20:00") ?? 0) + 1);
    }
  });

  return TRAVEL_TIMES.map((label) => ({ label, value: counts.get(label) ?? 0 }));
}

export function DashboardPage({
  onNavigate,
  presentToday,
  registeredPeople,
  records,
  source,
}: DashboardPageProps) {
  const total = registeredPeople;
  const absent = Math.max(total - presentToday, 0);
  const rate = total > 0 ? Math.round((presentToday / total) * 100) : 0;
  const todayISO = new Date().toISOString().slice(0, 10);
  const chartData = buildChartData(records, todayISO);

  const statCards = [
    {
      label: "Empleados",
      value: String(total),
      hint: "Registrados en el sistema",
      icon: <Icon name="employees" />,
      tone: "brand" as const,
    },
    {
      label: "Presentes hoy",
      value: String(presentToday),
      hint: total > 0 ? `${Math.round((presentToday / total) * 100)}% del total` : "Sin registros",
      icon: <Icon name="attendance" />,
      tone: "info" as const,
    },
    {
      label: "Ausentes hoy",
      value: String(absent),
      hint: total > 0 ? `${Math.round((absent / total) * 100)}% del total` : "Sin registros",
      icon: <Icon name="logout" />,
      tone: "danger" as const,
    },
    {
      label: "Tasa de asistencia",
      value: `${rate}%`,
      hint: "Presencia del día",
      icon: <Icon name="reports" />,
      tone: "warning" as const,
    },
  ];

  return (
    <div className="fc-page">
      <div className="fc-source-banner">
        <span className="fc-source-pill fc-source-pill--live">
          <i />
          Datos reales del backend
        </span>
      </div>

      <div className="fc-stat-grid">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="fc-dash-row">
        <Card className="fc-chart-card">
          <div className="fc-card-head">
            <div>
              <h2 className="fc-card-title">Asistencias hoy</h2>
            </div>
            <button className="fc-select">Hoy</button>
          </div>
          <AttendanceChart data={chartData} />
        </Card>

        <Card className="fc-records-card">
          <div className="fc-card-head">
            <h2 className="fc-card-title">Últimos registros</h2>
            <button className="fc-link" onClick={() => onNavigate("attendance")} type="button">
              Ver todos
            </button>
          </div>
          <RecentRecords records={records} />
        </Card>
      </div>

      <div className="fc-dash-lower">
        <Card className="fc-mini-card">
          <div className="fc-mini-card__icon fc-mini-card__icon--info">
            <Icon name="devices" />
          </div>
          <div>
            <div className="fc-mini-card__value">{registeredPeople}</div>
            <div className="fc-mini-card__label">Personas con imagen</div>
          </div>
        </Card>

        <Card
          className="fc-mini-card fc-clickable"
          onClick={() => onNavigate("liveRegister")}
          role="button"
          tabIndex={0}
        >
          <div className="fc-mini-card__icon fc-mini-card__icon--brand">
            <Icon name="camera" />
          </div>
          <div>
            <div className="fc-mini-card__label">Registro de asistencia</div>
            <div className="fc-mini-card__cta">Reconocer rostro →</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
