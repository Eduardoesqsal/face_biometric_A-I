export function Avatar({
  name,
  color,
  size = "md",
}: {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      className={`fc-avatar fc-avatar--${size}`}
      style={color ? { background: `${color}26`, color } : undefined}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

