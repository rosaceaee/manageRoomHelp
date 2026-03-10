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

      {/* 가구 추가 영역 */}
      {customCatalog.length > 0 && (
        <>
          <h4
            style={{
              color: "#fff",
              letterSpacing: "0.1em",
              margin: "10px 0 5px",
            }}
          >
            박스 추가
          </h4>
          {customCatalog.map((f, i) => (
            <div
              key={f.type}
              className="list"
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#162A3E")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#0D1B2E")
              }
              // e.currentTarget.style.background = "rgb(13, 27, 46)")
            >
              <div
                onMouseDown={(e) => onDragStart(e, f)}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "6px 0",
                  borderRadius: 5,
                  cursor: "grab",
                }}
              >
                <span className="icn">{f.icon}</span>
                <div>
                  <div className="label">{f.label}</div>
                  <div className="size">
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
        <h3>+ 추가</h3>
      </button>
    </>
  );
}
