export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm">{label}</span>
      <span className="flex items-center gap-2">
        <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>
          {value}
        </span>
        <span
          className="relative h-8 w-8 rounded-full border overflow-hidden shrink-0"
          style={{ background: value, borderColor: "var(--color-border)" }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -inset-2 cursor-pointer opacity-0"
            aria-label={label}
          />
        </span>
      </span>
    </label>
  );
}
