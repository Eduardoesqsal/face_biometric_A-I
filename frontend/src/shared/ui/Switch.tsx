export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
}) {
  return (
    <button
      className={`fc-switch ${checked ? "fc-switch--on" : ""}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      type="button"
    >
      <span className="fc-switch__thumb" />
    </button>
  );
}

