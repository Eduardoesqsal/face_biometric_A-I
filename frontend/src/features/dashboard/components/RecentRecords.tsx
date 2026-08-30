import type { AttendanceRecord } from "../../../domain/types";
import { Avatar, Badge } from "../../../shared/ui";

type RecentRecordsProps = {
  records: AttendanceRecord[];
};

function formatTime(timestamp: string): string {
  const rawTime = timestamp.split(" ")[1] ?? "00:00";
  const [hh, mm] = rawTime.split(":");
  const hour = Number(hh) || 0;
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${mm ?? "00"} ${period}`;
}

export function RecentRecords({ records }: RecentRecordsProps) {
  const items = records.slice(0, 5);
  if (!items.length) return <div className="fc-records fc-records--empty">Aún no hay registros de asistencia.</div>;
  return (
    <div className="fc-records">
      {items.map((record) => (
        <div className="fc-records__item" key={`${record.name}-${record.timestamp}`}>
          <Avatar name={record.name} size="sm" />
          <span className="fc-records__name">{record.name}</span>
          <Badge tone="success">Entrada</Badge>
          <span className="fc-records__time">{formatTime(record.timestamp)}</span>
        </div>
      ))}
    </div>
  );
}

