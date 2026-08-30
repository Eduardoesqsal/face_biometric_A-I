import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "success" | "danger" | "neutral" | "warning";
}) {
  return <span className={`fc-badge fc-badge--${tone}`}>{children}</span>;
}

