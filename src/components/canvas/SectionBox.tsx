import { useState, useEffect, useCallback } from "react";
import { CELL_PX } from "../../constants";
import { snapG } from "../../utils/grid";
import type { RoomSection, SectionColorScheme } from "../../types";

interface SectionBoxProps {
  section: RoomSection;
  scheme: SectionColorScheme;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (section: RoomSection) => void;
  onDelete: () => void;
  canDelete: boolean;
  boardRef: React.RefObject<HTMLDivElement | null>;
}

const HANDLES = [
  {
    edge: "n",
    s: { top: -4, left: "15%", width: "70%", height: 8, cursor: "n-resize" },
  },
  {
    edge: "s",
    s: { bottom: -4, left: "15%", width: "70%", height: 8, cursor: "s-resize" },
  },
  {
    edge: "e",
    s: { right: -4, top: "15%", width: 8, height: "70%", cursor: "e-resize" },
  },
  {
    edge: "w",
    s: { left: -4, top: "15%", width: 8, height: "70%", cursor: "w-resize" },
  },
  {
    edge: "se",
    s: { right: -5, bottom: -5, width: 12, height: 12, cursor: "se-resize" },
  },
  {
    edge: "sw",
    s: { left: -5, bottom: -5, width: 12, height: 12, cursor: "sw-resize" },
  },
  {
    edge: "ne",
    s: { right: -5, top: -5, width: 12, height: 12, cursor: "ne-resize" },
  },
  {
    edge: "nw",
    s: { left: -5, top: -5, width: 12, height: 12, cursor: "nw-resize" },
  },
];

export function SectionBox({
  section,
  scheme,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  canDelete,
  boardRef,
}: SectionBoxProps) {
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(section.name);

  useEffect(() => {
    setNameVal(section.name);
  }, [section.name]);

  const startMove = useCallback(
    (e: React.MouseEvent) => {
      if (["INPUT", "BUTTON"].includes((e.target as HTMLElement).tagName))
        return;
      e.stopPropagation();
      const rect = boardRef.current!.getBoundingClientRect();
      const offX = e.clientX - rect.left - section.gx * CELL_PX;
      const offY = e.clientY - rect.top - section.gy * CELL_PX;
      const orig = { ...section };
      const move = (me: MouseEvent) =>
        onUpdate({
          ...orig,
          gx: Math.max(0, snapG(me.clientX - rect.left - offX)),
          gy: Math.max(0, snapG(me.clientY - rect.top - offY)),
        });
      const up = () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    },
    [section, onUpdate, boardRef]
  );

  const startResize = useCallback(
    (e: React.MouseEvent, edge: string) => {
      e.stopPropagation();
      e.preventDefault();
      const sx = e.clientX,
        sy = e.clientY,
        orig = { ...section };
      const move = (me: MouseEvent) => {
        const dx = snapG(me.clientX - sx),
          dy = snapG(me.clientY - sy);
        const u = { ...orig };
        if (edge.includes("e")) u.w = Math.max(4, orig.w + dx);
        if (edge.includes("s")) u.h = Math.max(4, orig.h + dy);
        if (edge.includes("w")) {
          u.gx = orig.gx + dx;
          u.w = Math.max(4, orig.w - dx);
        }
        if (edge.includes("n")) {
          u.gy = orig.gy + dy;
          u.h = Math.max(4, orig.h - dy);
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
    [section, onUpdate]
  );

  return (
    <div
      onMouseDown={startMove}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      style={{
        left: section.gx * CELL_PX,
        top: section.gy * CELL_PX,
        width: section.w * CELL_PX,
        height: section.h * CELL_PX,
        background: scheme.bg,
        border: `2px solid ${scheme.border}`,
        boxShadow: isSelected ? `0 0 0 2px ${scheme.border}88` : "none",
      }}
      className="space-chips-wrap"
    >
      {/* Label row */}
      <div className="label-inner">
        {editingName ? (
          <input
            autoFocus
            value={nameVal}
            onChange={(e) => setNameVal(e.target.value)}
            onBlur={() => {
              onUpdate({ ...section, name: nameVal });
              setEditingName(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onUpdate({ ...section, name: nameVal });
                setEditingName(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="space-name"
          />
        ) : (
          <span
            onDoubleClick={(e) => {
              e.stopPropagation();
              setEditingName(true);
            }}
            className="space-name"
            title="공간 박스 영역. 더블클릭으로 이름 변경 가능"
          >
            {section.name}
          </span>
        )}

        {canDelete && isSelected && (
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="btn-del"
          >
            삭제
          </button>
        )}
      </div>

      {/* Size hint */}
      <div
        style={{
          position: "absolute",
          bottom: 5,
          right: 8,
          fontSize: 10,
          color: `${scheme.label}88`,
        }}
      >
        {section.w}×{section.h}
      </div>

      {/* Resize handles */}
      {isSelected &&
        HANDLES.map((h) => (
          <div
            key={h.edge}
            onMouseDown={(e) => startResize(e, h.edge)}
            style={{
              position: "absolute",
              ...h.s,
              background: scheme.border,
              opacity: 0.65,
              zIndex: 10,
            }}
          />
        ))}
    </div>
  );
}
