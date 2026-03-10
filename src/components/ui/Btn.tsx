import React from "react";

interface BtnProps {
  onClick?: () => void;
  children: React.ReactNode;
  danger?: boolean;
  warn?: boolean;
  sm?: boolean;
  green?: boolean;
  red?: boolean;
  size: "small" | "mid" | "lg";
}

export function Btn({
  onClick,
  children,
  danger,
  warn,
  sm,
  green,
  red,
}: BtnProps) {
  const bg = danger
    ? "#2A1010"
    : warn
    ? "#1E1C08"
    : green
    ? "#0A2A1A"
    : red
    ? "#2A0808"
    : "#0A1E30";
  const border = danger
    ? "#5A2020"
    : warn
    ? "#4A480E"
    : green
    ? "#1A6A3A"
    : red
    ? "#5A1010"
    : "#1A3A5A";
  const color = danger
    ? "#EF9A9A"
    : warn
    ? "#FFD54F"
    : green
    ? "#5ABB7A"
    : red
    ? "#D06060"
    : "#90CAF9";

  return (
    <button
      onClick={onClick}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: sm ? 4 : 6,
        color,
        fontSize: sm ? 11 : 12,
        padding: sm ? "6px 10px" : "5px 11px",
        cursor: "pointer",
        fontWeight: 500,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.3)")}
      onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
    >
      {children}
    </button>
  );
}
