import { FURNITURE_CATALOG } from "../../constants";
import type { CatalogItem, CatalogDrag } from "../../types";
import "../../assets/custom.scss";

interface CatalogListProps {
  customCatalog: CatalogItem[];
  compareMode: boolean;
  onDragStart: (e: React.MouseEvent, item: CatalogItem) => void;
  onRemoveCustom: (index: number) => void;
  onAddCustom: () => void;
}

export function CatalogList({
  customCatalog,
  compareMode,
  onDragStart,
  onRemoveCustom,
  onAddCustom,
}: CatalogListProps) {
  return (
    <>
      {/* <div style={{ fontSize: 10, color: "#3A5A7A", marginBottom: 6 }}>
        {compareMode ? "To-Be에 드래그해서 배치" : "드래그해서 배치"}
      </div> */}

      {FURNITURE_CATALOG.map((f) => (
        <div
          key={f.type}
          onMouseDown={(e) => onDragStart(e, f)}
          style={{
            marginBottom: 3,
            borderRadius: 5,
            cursor: "grab",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#162A3E")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#0D1B2E")}
          className="list"
        >
          <span className="icn">{f.icon}</span>
          <div className="furniture-box">
            <p className="label">{f.label}</p>
            <p className="size">
              {f.w}×{f.h}
            </p>
          </div>
        </div>
      ))}

      {customCatalog.length > 0 && (
        <>
          <div
            style={{
              fontSize: 10,
              color: "#4A6A4A",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              margin: "10px 0 5px",
            }}
          >
            커스텀
          </div>
          {customCatalog.map((f, i) => (
            <div
              key={f.type}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 3,
              }}
            >
              <div
                onMouseDown={(e) => onDragStart(e, f)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "6px 8px",
                  borderRadius: 5,
                  background: "#0D1E0D",
                  border: "1px solid #1E3A1E",
                  cursor: "grab",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#142A14")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#0D1E0D")
                }
              >
                <span style={{ fontSize: 15 }}>{f.icon}</span>
                <div>
                  <div
                    style={{ fontSize: 11, color: "#A8C8A8", fontWeight: 500 }}
                  >
                    {f.label}
                  </div>
                  <div style={{ fontSize: 9, color: "#2A4A2A" }}>
                    {f.w}×{f.h}칸
                  </div>
                </div>
              </div>
              <button
                onClick={() => onRemoveCustom(i)}
                style={{
                  background: "#2A0D0D",
                  border: "1px solid #4A1A1A",
                  borderRadius: 4,
                  color: "#C06060",
                  fontSize: 10,
                  padding: "3px 5px",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </>
      )}

      <button
        onClick={onAddCustom}
        style={{
          width: "100%",
          marginTop: 10,
          padding: "7px",
          background: "#0A1A0A",
          border: "1px dashed #2A5A2A",
          borderRadius: 7,
          color: "#4A9A4A",
          fontSize: 11,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#102010";
          e.currentTarget.style.borderColor = "#4A8A4A";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#0A1A0A";
          e.currentTarget.style.borderColor = "#2A5A2A";
        }}
      >
        <span style={{ fontSize: 14 }}>+</span> 커스텀 추가
      </button>
    </>
  );
}
