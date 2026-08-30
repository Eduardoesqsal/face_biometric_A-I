import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
  tone?: "brand" | "info" | "warning" | "danger";
};

export function StatCard({ label, value, hint, icon, tone = "brand" }: StatCardProps) {
  return (
    <div className="fc-stat-card">
      <div className="fc-stat-card__head">
        <span className={`fc-stat-card__icon fc-stat-card__icon--${tone}`}>{icon}</span>
        <span className="fc-stat-card__label">{label}</span>
      </div>
      <div className="fc-stat-card__value">{value}</div>
      <div className="fc-stat-card__hint">{hint}</div>
    </div>
  );
}

