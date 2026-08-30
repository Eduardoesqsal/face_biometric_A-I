import type { AttendanceChartPoint } from "../../../domain/types";

type AttendanceChartProps = {
  data: AttendanceChartPoint[];
};

const WIDTH = 640;
const HEIGHT = 220;
const PAD_X = 28;
const PAD_Y = 24;

function buildPath(data: AttendanceChartPoint[]): string {
  const max = Math.max(...data.map((point) => point.value));
  const stepX = (WIDTH - PAD_X * 2) / (data.length - 1);
  const usableHeight = HEIGHT - PAD_Y * 2;

  return data
    .map((point, index) => {
      const x = PAD_X + index * stepX;
      const y = PAD_Y + usableHeight - (point.value / max) * usableHeight;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function buildAreaPath(data: AttendanceChartPoint[]): string {
  const stepX = (WIDTH - PAD_X * 2) / (data.length - 1);
  const usableHeight = HEIGHT - PAD_Y * 2;
  const line = buildPath(data);
  const lastX = (PAD_X + (data.length - 1) * stepX).toFixed(1);
  const bottom = (PAD_Y + usableHeight).toFixed(1);
  return `${line} L${lastX},${bottom} L${PAD_X},${bottom} Z`;
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  const max = Math.max(...data.map((point) => point.value));
  const stepX = (WIDTH - PAD_X * 2) / (data.length - 1);
  const usableHeight = HEIGHT - PAD_Y * 2;

  return (
    <div className="fc-chart">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Gráfica de asistencias durante el día">
        <defs>
          <linearGradient id="fcArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((ratio) => {
          const y = PAD_Y + usableHeight - usableHeight * ratio;
          return <line key={ratio} x1={PAD_X} x2={WIDTH - PAD_X} y1={y} y2={y} stroke="var(--line)" strokeWidth="1" />;
        })}
        <path d={buildAreaPath(data)} fill="url(#fcArea)" />
        <path d={buildPath(data)} fill="none" stroke="var(--brand)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((point, index) => {
          const x = PAD_X + index * stepX;
          const y = PAD_Y + usableHeight - (point.value / max) * usableHeight;
          return <circle key={point.label} cx={x} cy={y} r="3.5" fill="var(--panel)" stroke="var(--brand)" strokeWidth="2" />;
        })}
      </svg>
      <div className="fc-chart__labels">
        {data.map((point) => <span key={point.label}>{point.label}</span>)}
      </div>
    </div>
  );
}

