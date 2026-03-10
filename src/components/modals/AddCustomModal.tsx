import { useState } from "react";
import { CUSTOM_ICONS, CUSTOM_COLORS, CELL_PX } from "../../constants";
import type { CatalogItem } from "../../types";

interface AddCustomModalProps {
  onAdd: (item: CatalogItem) => void;
  onClose: () => void;
}

const sizeBtn: React.CSSProperties = {
  width: 24,
  height: 24,
  background: "#0D1B2E",
  border: "1px solid #2A3A5A",
  borderRadius: 5,
  color: "#7A9AB4",
  fontSize: 14,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
};

export function AddCustomModal({ onAdd, onClose }: AddCustomModalProps) {
  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState("📦");
  const [color, setColor] = useState(CUSTOM_COLORS[0]);
  const [w, setW] = useState(2);
  const [h, setH] = useState(2);

  const canSubmit = label.trim().length > 0;

  const handleAdd = () => {
    if (!canSubmit) return;
    onAdd({
      type: `custom_${Date.now()}`,
      label: label.trim(),
      icon,
      color,
      w,
      h,
    });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 998,
        background: "rgba(6,10,22,0.80)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#141E38",
          border: "1px solid #253450",
          borderRadius: 16,
          padding: "28px 30px",
          width: 340,
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#E8E4DC",
            marginBottom: 20,
          }}
        >
          커스텀 가구 추가
        </div>

        {/* Preview */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: w * CELL_PX,
              height: h * CELL_PX,
              minWidth: CELL_PX,
              minHeight: CELL_PX,
              background: color,
              borderRadius: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: `2px solid ${color}BB`,
              boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
              transition: "all 0.15s",
            }}
          >
            <div style={{ fontSize: Math.min(w, h) * CELL_PX * 0.3 }}>
              {icon}
            </div>
            {w * CELL_PX > 30 && (
              <div
                style={{
                  fontSize: Math.min(10, w * CELL_PX * 0.16),
                  color: "rgba(255,255,255,0.85)",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  padding: "0 2px",
                }}
              >
                {label || "이름 없음"}
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 10,
              color: "#4A6A8A",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 5,
            }}
          >
            이름
          </div>
          <input
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="예: 에어컨, 피아노..."
            style={{
              width: "100%",
              background: "#0D1B2E",
              border: `1px solid ${canSubmit ? "#2A5A8A" : "#1E2E42"}`,
              borderRadius: 8,
              color: "#E8E4DC",
              padding: "9px 12px",
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
              transition: "border 0.15s",
            }}
          />
        </div>

        {/* Icon picker */}
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 10,
              color: "#4A6A8A",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 5,
            }}
          >
            아이콘
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {CUSTOM_ICONS.map((ic) => (
              <button
                key={ic}
                onClick={() => setIcon(ic)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  fontSize: 16,
                  background: icon === ic ? "#1A3A5A" : "#0D1B2E",
                  border:
                    icon === ic ? "2px solid #4A8ABE" : "1px solid #1E2E42",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.1s",
                }}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* Color picker */}
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 10,
              color: "#4A6A8A",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 5,
            }}
          >
            색상
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {CUSTOM_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 5,
                  background: c,
                  border:
                    color === c ? "2px solid #FFD700" : "2px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.1s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Size */}
        <div style={{ marginBottom: 22 }}>
          <div
            style={{
              fontSize: 10,
              color: "#4A6A8A",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 5,
            }}
          >
            크기 (칸)
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {[
              { val: w, set: setW, label: "가로" },
              { val: h, set: setH, label: "세로" },
            ].map((axis, idx) => (
              <div key={idx} style={{ flex: 1 }}>
                <div
                  style={{ fontSize: 10, color: "#3A5A7A", marginBottom: 3 }}
                >
                  {axis.label}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <button
                    onClick={() => axis.set((v) => Math.max(1, v - 1))}
                    style={sizeBtn}
                  >
                    −
                  </button>
                  <span
                    style={{
                      fontSize: 14,
                      color: "#C8D8E8",
                      minWidth: 18,
                      textAlign: "center",
                    }}
                  >
                    {axis.val}
                  </span>
                  <button
                    onClick={() => axis.set((v) => Math.min(10, v + 1))}
                    style={sizeBtn}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "9px",
              background: "transparent",
              border: "1px solid #253450",
              borderRadius: 9,
              color: "#4A6A8A",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            취소
          </button>
          <button
            onClick={handleAdd}
            disabled={!canSubmit}
            style={{
              flex: 2,
              padding: "9px",
              borderRadius: 9,
              fontSize: 13,
              fontWeight: 700,
              cursor: canSubmit ? "pointer" : "not-allowed",
              background: canSubmit ? "#1A4A8A" : "#0D1B2E",
              border: canSubmit ? "1px solid #2A6AAA" : "1px solid #1E2E42",
              color: canSubmit ? "#90CAF9" : "#3A5A7A",
              transition: "all 0.15s",
            }}
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
}
