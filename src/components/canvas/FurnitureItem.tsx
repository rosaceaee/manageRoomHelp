import { useCallback } from "react";
import { CELL_PX, BOARD_W, BOARD_H } from "../../constants";
import { snapG } from "../../utils/grid";
import { TodoPanel } from "../panels/TodoPanel";
import type { FurnitureItemData } from "../../types";

interface FurnitureItemProps {
  item: FurnitureItemData;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (item: FurnitureItemData) => void;
  // boardRef: React.RefObject<HTMLDivElement>;
  boardRef: React.RefObject<HTMLDivElement | null>;
}

const HANDLES = [
  {
    edge: "n",
    s: { top: -4, left: "20%", width: "60%", height: 7, cursor: "n-resize" },
  },
  {
    edge: "s",
    s: { bottom: -4, left: "20%", width: "60%", height: 7, cursor: "s-resize" },
  },
  {
    edge: "e",
    s: { right: -4, top: "20%", width: 7, height: "60%", cursor: "e-resize" },
  },
  {
    edge: "w",
    s: { left: -4, top: "20%", width: 7, height: "60%", cursor: "w-resize" },
  },
  {
    edge: "se",
    s: { right: -5, bottom: -5, width: 10, height: 10, cursor: "se-resize" },
  },
  {
    edge: "sw",
    s: { left: -5, bottom: -5, width: 10, height: 10, cursor: "sw-resize" },
  },
  {
    edge: "ne",
    s: { right: -5, top: -5, width: 10, height: 10, cursor: "ne-resize" },
  },
  {
    edge: "nw",
    s: { left: -5, top: -5, width: 10, height: 10, cursor: "nw-resize" },
  },
];

export function FurnitureItem({
  item,
  isSelected,
  onSelect,
  onUpdate,
  boardRef,
}: FurnitureItemProps) {
  const startMove = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).dataset.resize) return;
      e.stopPropagation();
      const rect = boardRef.current!.getBoundingClientRect();
      const offX = e.clientX - rect.left - item.gx * CELL_PX;
      const offY = e.clientY - rect.top - item.gy * CELL_PX;
      const orig = { ...item };
      const move = (me: MouseEvent) => {
        const gx = Math.max(
          0,
          Math.min(snapG(me.clientX - rect.left - offX), BOARD_W - orig.w)
        );
        const gy = Math.max(
          0,
          Math.min(snapG(me.clientY - rect.top - offY), BOARD_H - orig.h)
        );
        onUpdate({ ...orig, gx, gy });
      };
      const up = () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    },
    [item, onUpdate, boardRef]
  );

  const startResize = useCallback(
    (e: React.MouseEvent, edge: string) => {
      e.stopPropagation();
      e.preventDefault();
      const sx = e.clientX,
        sy = e.clientY,
        orig = { ...item };
      const move = (me: MouseEvent) => {
        const dx = snapG(me.clientX - sx),
          dy = snapG(me.clientY - sy);
        const u = { ...orig };
        if (edge.includes("e")) u.w = Math.max(1, orig.w + dx);
        if (edge.includes("s")) u.h = Math.max(1, orig.h + dy);
        if (edge.includes("w")) {
          u.gx = Math.max(0, orig.gx + dx);
          u.w = Math.max(1, orig.w - dx);
        }
        if (edge.includes("n")) {
          u.gy = Math.max(0, orig.gy + dy);
          u.h = Math.max(1, orig.h - dy);
        }
        onUpdate(u);
      };
      const up = () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    },
    [item, onUpdate]
  );

  const hasTodos = (item.todos?.length ?? 0) > 0;
  const hasTrash = item.todos?.some((t) => t.status === "trash");
  const hasKeep = item.todos?.some((t) => t.status === "keep");
  const badgeColor = hasTrash ? "#C05050" : hasKeep ? "#3A8A5A" : "#4A5A7A";

  return (
    <div
      onMouseDown={startMove}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      style={{
        left: item.gx * CELL_PX,
        top: item.gy * CELL_PX,
        width: item.w * CELL_PX,
        height: item.h * CELL_PX,
        background: item.color,
        border: isSelected ? "2px solid #FFD700" : `2px solid ${item.color}BB`,
        boxShadow: isSelected
          ? "0 0 0 2px #FFD700,0 4px 12px rgba(0,0,0,0.3)"
          : "0 2px 6px rgba(0,0,0,0.2)",
        zIndex: isSelected ? 10 : 5,
      }}
      className="box-furniture-on-canvas"
    >
      {/* Inner content */}
      <div
        style={{
          overflow: "hidden",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div style={{ fontSize: Math.min(item.w, item.h) * CELL_PX * 0.28 }}>
          {item.icon}
        </div>
        <div
          style={{
            fontSize: Math.min(17, item.w * CELL_PX * 0.16),
            color: "rgba(255,255,255,0.85)",
            fontWeight: 600,
            textAlign: "center",
            padding: "0 2px",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {item.label}
        </div>
        {isSelected && (
          <div
            style={{
              position: "absolute",
              bottom: 2,
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: 9,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {item.w}×{item.h}
          </div>
        )}
        {item.note && !isSelected && (
          <div
            style={{
              position: "absolute",
              bottom: 2,
              right: 3,
              fontSize: 8,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            📝
          </div>
        )}
        {/* badge */}
        {hasTodos && (
          <div
            style={{
              background: badgeColor,
            }}
            className="badge-num"
          >
            {item.todos!.length}
          </div>
        )}
      </div>

      {/* Resize handles */}
      {isSelected &&
        HANDLES.map((h) => (
          <div
            key={h.edge}
            data-resize="1"
            onMouseDown={(e) => startResize(e, h.edge)}
            style={{
              position: "absolute",
              ...h.s,
              background: "#FFD700",
              opacity: 0.85,
              borderRadius: 2,
              zIndex: 20,
            }}
          />
        ))}

      {/* Todo floating panel */}
      {isSelected && <TodoPanel item={item} onUpdate={onUpdate} />}
    </div>
  );
}
