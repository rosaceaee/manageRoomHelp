interface StatCardProps {
  label: string;
  value: number;
  unit: string;
  color: string;
}

export function StatCard({ label, value, unit, color }: StatCardProps) {
  return (
    <div
      style={{
        background: "#0D1B2E",
        borderRadius: 7,
        padding: "8px 10px",
        border: "1px solid #1E2E42",
      }}
    >
      <div style={{ fontSize: 10, color: "#4A6A8A", marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color }}>{value}</span>
        <span style={{ fontSize: 10, color: "#3A5A7A" }}>{unit}</span>
      </div>
    </div>
  );
}
