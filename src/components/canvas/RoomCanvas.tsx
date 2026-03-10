import { useRef, useCallback } from "react";
import { CELL_PX, BOARD_W, BOARD_H, SECTION_COLORS } from "../../constants";
import { snapG } from "../../utils/grid";
import { newId } from "../../utils/id";
import { SectionBox } from "./SectionBox";
import { FurnitureItem } from "./FurnitureItem";
import type { FurnitureItemData, RoomSection, CatalogDrag } from "../../types";

interface RoomCanvasProps {
  items: FurnitureItemData[];
  sections: RoomSection[];
  setItems: React.Dispatch<React.SetStateAction<FurnitureItemData[]>>;
  setSections: React.Dispatch<React.SetStateAction<RoomSection[]>>;
  selItemId: number | null;
  setSelItemId: (id: number | null) => void;
  selSectionId: number | null;
  setSelSectionId: (id: number | null) => void;
  catalogDrag: CatalogDrag | null;
  setCatalogDrag: React.Dispatch<React.SetStateAction<CatalogDrag | null>>;
  readonly: boolean;
}

export function RoomCanvas({
  items,
  sections,
  setItems,
  setSections,
  selItemId,
  setSelItemId,
  selSectionId,
  setSelSectionId,
  catalogDrag,
  setCatalogDrag,
  readonly,
}: RoomCanvasProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!catalogDrag || readonly) return;
      const rect = boardRef.current!.getBoundingClientRect();
      setCatalogDrag((p) =>
        p
          ? {
              ...p,
              gx: snapG(e.clientX - rect.left - (p.w * CELL_PX) / 2),
              gy: snapG(e.clientY - rect.top - (p.h * CELL_PX) / 2),
            }
          : null
      );
    },
    [catalogDrag, readonly, setCatalogDrag]
  );

  const onMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!catalogDrag || readonly) return;
      const rect = boardRef.current!.getBoundingClientRect();
      const mx = e.clientX - rect.left,
        my = e.clientY - rect.top;
      if (
        mx >= 0 &&
        mx <= BOARD_W * CELL_PX &&
        my >= 0 &&
        my <= BOARD_H * CELL_PX
      ) {
        const gx = Math.max(
          0,
          Math.min(
            snapG(mx - (catalogDrag.w * CELL_PX) / 2),
            BOARD_W - catalogDrag.w
          )
        );
        const gy = Math.max(
          0,
          Math.min(
            snapG(my - (catalogDrag.h * CELL_PX) / 2),
            BOARD_H - catalogDrag.h
          )
        );
        setItems((p) => [
          ...p,
          {
            ...catalogDrag,
            id: newId(),
            gx,
            gy,
            rotation: 0,
            note: "",
            todos: [],
          },
        ]);
      }
      setCatalogDrag(null);
    },
    [catalogDrag, readonly, setItems, setCatalogDrag]
  );

  return (
    <div
      ref={boardRef}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onClick={() => {
        if (!readonly) {
          setSelItemId(null);
          setSelSectionId(null);
        }
      }}
      style={{
        position: "relative",
        width: BOARD_W * CELL_PX,
        height: BOARD_H * CELL_PX,
        background: "#F7F3EC",
        backgroundImage: `linear-gradient(to right,#DDD5C5 1px,transparent 1px),linear-gradient(to bottom,#DDD5C5 1px,transparent 1px)`,
        backgroundSize: `${CELL_PX}px ${CELL_PX}px`,
        border: "3px solid #8B7355",
        borderRadius: 3,
        boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
        flexShrink: 0,
        cursor: readonly ? "default" : catalogDrag ? "copy" : "default",
        opacity: readonly ? 0.65 : 1,
        pointerEvents: readonly ? "none" : "auto",
      }}
    >
      {sections.map((s, i) => (
        <SectionBox
          key={s.id}
          section={s}
          scheme={SECTION_COLORS[i % 3]}
          isSelected={!readonly && selSectionId === s.id}
          onSelect={() => {
            setSelSectionId(s.id);
            setSelItemId(null);
          }}
          onUpdate={(upd) =>
            setSections((p) => p.map((sec) => (sec.id === s.id ? upd : sec)))
          }
          onDelete={() => {
            setSections((p) => p.filter((sec) => sec.id !== s.id));
            setSelSectionId(null);
          }}
          canDelete={sections.length > 1}
          boardRef={boardRef}
        />
      ))}

      {catalogDrag && !readonly && (
        <div
          style={{
            position: "absolute",
            left:
              Math.max(0, Math.min(catalogDrag.gx, BOARD_W - catalogDrag.w)) *
              CELL_PX,
            top:
              Math.max(0, Math.min(catalogDrag.gy, BOARD_H - catalogDrag.h)) *
              CELL_PX,
            width: catalogDrag.w * CELL_PX,
            height: catalogDrag.h * CELL_PX,
            background: catalogDrag.color + "55",
            border: `2px dashed ${catalogDrag.color}`,
            borderRadius: 5,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            zIndex: 20,
          }}
        >
          {catalogDrag.icon}
        </div>
      )}

      {items.map((item) => (
        <FurnitureItem
          key={item.id}
          item={item}
          isSelected={!readonly && selItemId === item.id}
          onSelect={() => {
            if (!readonly) {
              setSelItemId(item.id);
              setSelSectionId(null);
            }
          }}
          onUpdate={(upd) => {
            if (!readonly)
              setItems((p) => p.map((it) => (it.id === item.id ? upd : it)));
          }}
          boardRef={boardRef}
        />
      ))}
    </div>
  );
}
