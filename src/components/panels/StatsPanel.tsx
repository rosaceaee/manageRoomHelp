import { StatCard } from "../ui/StatCard";
import type { FurnitureItemData, TrashItem } from "../../types";

interface StatsPanelProps {
  items: FurnitureItemData[];
  sections: { length: number };
  trashList: TrashItem[];
  compareMode: boolean;
  tobeItems: FurnitureItemData[];
}

export function StatsPanel({
  items,
  sections,
  trashList,
  compareMode,
  tobeItems,
}: StatsPanelProps) {
  return (
    <div
      className="box right"
      style={{
        borderLeft: "1px solid #243050",
      }}
    >
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.12em",
          color: "#4A6A8A",
          textTransform: "uppercase",
        }}
      >
        현황
      </div>

      {compareMode ? (
        <>
          <div style={{ fontSize: 10, color: "#7A7AAA", fontWeight: 600 }}>
            AS-IS
          </div>
          <StatCard
            label="가구"
            value={items.length}
            unit="개"
            color="#7A9AAA"
          />
          <div
            style={{
              fontSize: 10,
              color: "#4A9A6A",
              fontWeight: 600,
              marginTop: 4,
            }}
          >
            TO-BE
          </div>
          <StatCard
            label="가구"
            value={tobeItems.length}
            unit="개"
            color="#4ABB8A"
          />
          <div
            style={{
              padding: "8px 0",
              borderTop: "1px solid #243050",
              marginTop: 2,
            }}
          >
            <div style={{ fontSize: 10, color: "#4A6A8A", marginBottom: 4 }}>
              가구 변화
            </div>
            {(() => {
              const diff = tobeItems.length - items.length;
              return (
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color:
                      diff > 0 ? "#EF9A9A" : diff < 0 ? "#4ABB8A" : "#5A7A9A",
                  }}
                >
                  {diff === 0
                    ? "변화 없음"
                    : diff > 0
                    ? `+${diff}개 추가`
                    : `${diff}개 제거`}
                </div>
              );
            })()}
          </div>
        </>
      ) : (
        <>
          <StatCard
            label="섹션"
            value={sections.length}
            unit="개"
            color="#A5D6A7"
          />
          <StatCard
            label="배치 가구"
            value={items.length}
            unit="개"
            color="#64B5F6"
          />
          <StatCard
            label="버릴 목록"
            value={trashList.length}
            unit="개"
            color="#EF9A9A"
          />
          <div
            style={{
              marginTop: "auto",
              borderTop: "1px solid #243050",
              paddingTop: 10,
            }}
          >
            <div style={{ fontSize: 10, color: "#3A5A7A", marginBottom: 6 }}>
              버릴 것 (Todo)
            </div>
            {(() => {
              const trashTodos = items.flatMap((it) =>
                (it.todos ?? [])
                  .filter((t) => t.status === "trash")
                  .map((t) => ({
                    ...t,
                    itemIcon: it.icon,
                  }))
              );
              return trashTodos.length === 0 ? (
                <div style={{ fontSize: 10, color: "#1A3A5A" }}>없음</div>
              ) : (
                trashTodos.map((t) => (
                  <div key={t.id} style={{ marginBottom: 5 }}>
                    <div style={{ fontSize: 10, color: "#C08080" }}>
                      {t.itemIcon} {t.text}
                    </div>
                    {t.memo && (
                      <div
                        style={{
                          fontSize: 9,
                          color: "#6A4040",
                          paddingLeft: 4,
                        }}
                      >
                        ↳ {t.memo}
                      </div>
                    )}
                  </div>
                ))
              );
            })()}
          </div>
        </>
      )}
    </div>
  );
}
