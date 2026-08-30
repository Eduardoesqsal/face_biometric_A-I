type Segment = { label: string; value: number; color: string };

type DonutChartProps = {
  segments: Segment[];
};

function getCumulativeOffset(segments: Segment[], index: number): number {
  return segments.slice(0, index).reduce((sum, segment) => sum + segment.value, 0);
}

export function DonutChart({ segments }: DonutChartProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  const size = 120;
  const radius = 42;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  return (
    <div className="fc-donut" aria-label="Resumen circular de asistencias">
      <svg viewBox={`0 0 ${size} ${size}`}>
        <circle cx="60" cy="60" r={normalizedRadius} fill="none" stroke="var(--panel-hover)" strokeWidth={stroke} />
        {segments.map((segment, index) => {
          const dashoffset = circumference - (circumference * getCumulativeOffset(segments, index)) / total;
          return (
            <circle
              key={segment.label}
              cx="60"
              cy="60"
              r={normalizedRadius}
              fill="none"
              stroke={segment.color}
              strokeWidth={stroke}
              strokeDasharray={`${circumference}`}
              strokeDashoffset={dashoffset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
          );
        })}
      </svg>
      <div className="fc-donut__center">
        <strong>{total}</strong>
        <span>Total</span>
      </div>
    </div>
  );
}

