import { useState, useEffect, useCallback } from "react";
import { SECTION_COLORS, STORAGE_KEY } from "./constants";
import { newId, setUid } from "./utils/id";
import { usePersist } from "./hooks/usePersist";

import { SetupModal } from "./components/modals/SetupModal";
import { AddCustomModal } from "./components/modals/AddCustomModal";
import { RoomCanvas } from "./components/canvas/RoomCanvas";
import { CatalogList } from "./components/panels/CatalogList";
import { StatsPanel } from "./components/panels/StatsPanel";
import { Btn } from "./components/ui/Btn";

import type {
  FurnitureItemData,
  RoomSection,
  TrashItem,
  CatalogItem,
  CatalogDrag,
  PersistedState,
} from "./types";

export default function App() {
  const [showModal, setShowModal] = useState(true);
  const [sections, setSections] = useState<RoomSection[]>([]);
  const [items, setItems] = useState<FurnitureItemData[]>([]);
  const [trashList, setTrashList] = useState<TrashItem[]>([]);
  const [selItemId, setSelItemId] = useState<number | null>(null);
  const [selSectionId, setSelSectionId] = useState<number | null>(null);
  const [catalogDrag, setCatalogDrag] = useState<CatalogDrag | null>(null);
  const [tab, setTab] = useState<"catalog" | "trash">("catalog");
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customCatalog, setCustomCatalog] = useState<CatalogItem[]>([]);

  // Compare mode
  const [compareMode, setCompareMode] = useState(false);
  const [tobeItems, setTobeItems] = useState<FurnitureItemData[]>([]);
  const [tobeSections, setTobeSections] = useState<RoomSection[]>([]);
  const [tobeSelItemId, setTobeSelItemId] = useState<number | null>(null);
  const [tobeSelSectionId, setTobeSelSectionId] = useState<number | null>(null);
  const [tobeCatalogDrag, setTobeCatalogDrag] = useState<CatalogDrag | null>(
    null
  );

  const selItem = items.find((i) => i.id === selItemId);
  const tobeSelItem = tobeItems.find((i) => i.id === tobeSelItemId);

  // ── Persist ──
  const persistState: PersistedState = {
    items,
    sections,
    trashList,
    customCatalog,
    nextUid: 0,
  };

  const handleLoadState = useCallback((saved: PersistedState) => {
    if (saved.items) setItems(saved.items);
    if (saved.sections) {
      setSections(saved.sections);
      setShowModal(false);
    }
    if (saved.trashList) setTrashList(saved.trashList);
    if (saved.customCatalog) setCustomCatalog(saved.customCatalog);
    if (saved.nextUid) setUid(saved.nextUid);
  }, []);

  const { flash, handleExport, handleImport, handleClear } = usePersist(
    persistState,
    handleLoadState
  );

  // ── Global mouseup ──
  useEffect(() => {
    const up = () => {
      setCatalogDrag(null);
      setTobeCatalogDrag(null);
    };
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  // ── Setup ──
  const handleSetup = ({ sections }: { sections: RoomSection[] }) => {
    setSections(sections);
    setShowModal(false);
  };

  // ── Compare mode ──
  const enterCompareMode = () => {
    setTobeItems(items.map((it) => ({ ...it, id: newId() })));
    setTobeSections(sections.map((s) => ({ ...s, id: newId() })));
    setTobeSelItemId(null);
    setTobeSelSectionId(null);
    setCompareMode(true);
  };
  const exitCompareMode = () => {
    setCompareMode(false);
    setTobeCatalogDrag(null);
  };
  const applyTobe = () => {
    if (!confirm("To-Be 배치를 현재 배치로 덮어쓸까요?")) return;
    setItems(tobeItems);
    setSections(tobeSections);
    exitCompareMode();
  };

  // ── Item actions ──
  const rotateItem = () =>
    selItemId &&
    setItems((p) =>
      p.map((it) =>
        it.id === selItemId
          ? { ...it, w: it.h, h: it.w, rotation: (it.rotation + 90) % 360 }
          : it
      )
    );
  const deleteItem = () => {
    setItems((p) => p.filter((i) => i.id !== selItemId));
    setSelItemId(null);
  };
  const toTrash = () => {
    const it = items.find((i) => i.id === selItemId);
    if (!it) return;
    setTrashList((p) => [...p, { ...it, trashId: newId() }]);
    setItems((p) => p.filter((i) => i.id !== selItemId));
    setSelItemId(null);
  };
  const restoreTrash = (ti: TrashItem) => {
    setItems((p) => [...p, { ...ti, id: newId(), gx: 1, gy: 1 }]);
    setTrashList((p) => p.filter((i) => i.trashId !== ti.trashId));
  };
  const rotateTobeItem = () =>
    tobeSelItemId &&
    setTobeItems((p) =>
      p.map((it) =>
        it.id === tobeSelItemId
          ? { ...it, w: it.h, h: it.w, rotation: (it.rotation + 90) % 360 }
          : it
      )
    );
  const deleteTobeItem = () => {
    setTobeItems((p) => p.filter((i) => i.id !== tobeSelItemId));
    setTobeSelItemId(null);
  };
  const addSection = () =>
    setSections((p) => [
      ...p,
      { id: newId(), name: `공간 ${p.length + 1}`, gx: 2, gy: 2, w: 12, h: 10 },
    ]);

  const startCatalogDrag = (e: React.MouseEvent, f: CatalogItem) => {
    e.preventDefault();
    setCatalogDrag({ ...f, gx: 0, gy: 0 });
  };
  const startTobeCatalogDrag = (e: React.MouseEvent, f: CatalogItem) => {
    e.preventDefault();
    setTobeCatalogDrag({ ...f, gx: 0, gy: 0 });
  };

  const handleReset = () => {
    if (!confirm("초기화하고 처음부터 다시 설정할까요?")) return;
    setItems([]);
    setTrashList([]);
    setSections([]);
    setSelItemId(null);
    exitCompareMode();
    handleClear();
    setShowModal(true);
  };

  if (showModal) return <SetupModal onComplete={handleSetup} />;

  return (
    <>
      {showCustomModal && (
        <AddCustomModal
          onAdd={(f) => setCustomCatalog((p) => [...p, f])}
          onClose={() => setShowCustomModal(false)}
        />
      )}

      <div className="wrap">
        {/*  LEFT SIDEBAR  */}
        <div className="box left">
          <section className="top">
            <h1 className="tit">🏠 방 정리를 하자</h1>

            {/* 임시 비교모드 영역 */}
            {!compareMode && (
              <section
                className="inner choose-space"
                style={{
                  borderBottom: "1px solid #243050",
                }}
              >
                <section
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h3
                    style={{
                      color: "#333",
                    }}
                  >
                    공간
                  </h3>
                  <button
                    onClick={addSection}
                    style={{
                      background: "#0A2016",
                      border: "1px solid #1A5A2A",
                      borderRadius: 5,
                      color: "#5ABB7A",
                      fontSize: 11,
                      padding: "2px 8px",
                      cursor: "pointer",
                    }}
                  >
                    + 추가
                  </button>
                </section>

                <section className="space-wrap ">
                  {sections.map((s, i) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setSelSectionId(s.id);
                        setSelItemId(null);
                      }}
                      className="space"
                      style={{
                        cursor: "pointer",
                        background:
                          selSectionId === s.id ? "#0D2A3E" : "#0D1B2E",
                        border: `1px solid ${SECTION_COLORS[i % 3].border}44`,
                      }}
                    >
                      <button
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 2,
                          background: SECTION_COLORS[i % 3].border,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 12, color: "#C8D8E8", flex: 1 }}>
                        {s.name}
                      </span>
                      <span style={{ fontSize: 10, color: "#3A5A7A" }}>
                        {s.w}×{s.h}
                      </span>
                    </div>
                  ))}
                </section>
              </section>
            )}
          </section>

          {/* 탭 */}
          <div className="tab">
            {(["catalog", "trash"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  fontWeight: tab === t ? 700 : 400,
                  borderBottom:
                    tab === t
                      ? "2px solid transparent"
                      : "2px solid transparent",
                }}
                className={tab === t ? "el active" : "el"}
              >
                {t === "catalog"
                  ? "🛋 가구"
                  : `🗑 버릴것${
                      trashList.length > 0 ? ` (${trashList.length})` : ""
                    }`}
              </button>
            ))}
          </div>

          <div className="catalog-wrap">
            {tab === "catalog" && (
              <CatalogList
                customCatalog={customCatalog}
                compareMode={compareMode}
                onDragStart={
                  compareMode ? startTobeCatalogDrag : startCatalogDrag
                }
                onRemoveCustom={(i) =>
                  setCustomCatalog((p) => p.filter((_, j) => j !== i))
                }
                onAddCustom={() => setShowCustomModal(true)}
              />
            )}
            {tab === "trash" && (
              <>
                {trashList.length === 0 ? (
                  <div className="notice-wrap empty">
                    <h1 className="tit none">버릴 가구 없음</h1>
                  </div>
                ) : (
                  trashList.map((ti) => (
                    <div
                      key={ti.trashId}
                      style={{
                        background: "#2A1515",
                        border: "1px solid #4A2525",
                      }}
                      className="list will-delete"
                    >
                      <span className="icn">{ti.icon}</span>
                      <div className="furniture-box">
                        <p className="label">{ti.label}</p>
                        {ti.note && (
                          <div style={{ fontSize: 9, color: "#906060" }}>
                            {ti.note}
                          </div>
                        )}
                      </div>

                      <div
                        style={{ display: "flex", gap: 3, marginLeft: "auto" }}
                      >
                        <Btn sm green onClick={() => restoreTrash(ti)}>
                          ↩
                        </Btn>
                        <Btn
                          sm
                          red
                          onClick={() =>
                            setTrashList((p) =>
                              p.filter((i) => i.trashId !== ti.trashId)
                            )
                          }
                        >
                          ✕
                        </Btn>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>

          {/* 하단 */}
          <div className="bottom-wrap">
            {flash && (
              <div
                style={{
                  textAlign: "center",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "5px",
                  borderRadius: 6,
                  color: flash === "saved" ? "#5ABB7A" : "#64B5F6",
                  background: flash === "saved" ? "#0A2018" : "#0A1E38",
                  border: `1px solid ${
                    flash === "saved" ? "#1A5A30" : "#1A4A7A"
                  }`,
                }}
              >
                {flash === "saved" ? "✓ 저장 완료" : "✓ 불러오기 완료"}
              </div>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "2px 4px",
              }}
            >
              {/* <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#3A8A5A",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 10, color: "#3A6A4A" }}>
                자동저장 중
              </span> */}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={handleExport}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#102A3E")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#0A1E30")
                }
              >
                📥 작업파일 저장
              </button>
              <button
                onClick={handleImport}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#102A3E")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#0A1E30")
                }
              >
                📤 불러오기
              </button>
            </div>
            <button onClick={handleReset} className="btn-init">
              🔄 초기화
            </button>
          </div>
        </div>

        {/*  중앙 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* 툴바 */}
          <div
            style={{
              height: 46,
              background: "#0F3460",
              borderBottom: "1px solid #1E3A60",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              gap: 8,
              flexShrink: 0,
            }}
          >
            {compareMode ? (
              <>
                {tobeSelItem ? (
                  <>
                    <span style={{ fontSize: 12, color: "#7A9AB4" }}>
                      <strong style={{ color: "#E8E4DC" }}>
                        {tobeSelItem.icon} {tobeSelItem.label}
                      </strong>
                      <span style={{ color: "#3A7A5A", fontSize: 11 }}>
                        {" "}
                        · To-Be
                      </span>
                    </span>
                    <Btn onClick={rotateTobeItem}>↻ 회전</Btn>
                    <Btn danger onClick={deleteTobeItem}>
                      🗑 삭제
                    </Btn>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 5 }}
                    >
                      <span style={{ fontSize: 11, color: "#3A5A7A" }}>
                        메모
                      </span>
                      <input
                        value={tobeSelItem.note}
                        onChange={(e) =>
                          setTobeItems((p) =>
                            p.map((it) =>
                              it.id === tobeSelItemId
                                ? { ...it, note: e.target.value }
                                : it
                            )
                          )
                        }
                        placeholder="메모..."
                        style={{
                          background: "#1A2A4A",
                          border: "1px solid #2A4A6A",
                          borderRadius: 5,
                          color: "#C8D8E8",
                          padding: "4px 8px",
                          fontSize: 12,
                          width: 150,
                          outline: "none",
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <span style={{ fontSize: 12, color: "#3A5A6A" }}>
                    To-Be 캔버스에서 가구를 편집하세요
                  </span>
                )}
                <div style={{ marginLeft: "auto", display: "flex", gap: 7 }}>
                  <button
                    onClick={applyTobe}
                    style={{
                      background: "#0A2A18",
                      border: "1px solid #1A6A40",
                      borderRadius: 7,
                      color: "#4ABB8A",
                      padding: "6px 14px",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    ✓ To-Be 적용
                  </button>
                  <button
                    onClick={exitCompareMode}
                    style={{
                      background: "#1A1A2A",
                      border: "1px solid #2A2A4A",
                      borderRadius: 7,
                      color: "#6A8AAA",
                      padding: "6px 12px",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    ✕ 닫기
                  </button>
                </div>
              </>
            ) : (
              <>
                {selItem ? (
                  <>
                    <span style={{ fontSize: 13, color: "#7A9AB4" }}>
                      <strong style={{ color: "#E8E4DC" }}>
                        {selItem.icon} {selItem.label}
                      </strong>{" "}
                      선택됨
                    </span>
                    <Btn onClick={rotateItem}>↻ 회전</Btn>
                    <Btn danger onClick={deleteItem}>
                      🗑 삭제
                    </Btn>
                    <Btn warn onClick={toTrash}>
                      📋 버릴 목록
                    </Btn>
                    <div
                      style={{
                        marginLeft: "auto",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <span style={{ fontSize: 11, color: "#3A5A7A" }}>
                        메모
                      </span>
                      <input
                        value={selItem.note}
                        onChange={(e) =>
                          setItems((p) =>
                            p.map((it) =>
                              it.id === selItemId
                                ? { ...it, note: e.target.value }
                                : it
                            )
                          )
                        }
                        placeholder="이 가구 메모..."
                        style={{
                          background: "#1A2A4A",
                          border: "1px solid #2A4A6A",
                          borderRadius: 5,
                          color: "#C8D8E8",
                          padding: "4px 10px",
                          fontSize: 12,
                          width: 180,
                          outline: "none",
                        }}
                      />
                    </div>
                  </>
                ) : selSectionId ? (
                  <span style={{ fontSize: 12, color: "#4A6A8A" }}>
                    섹션 선택됨.
                    <span style={{ color: "#7A9AB4" }}>
                      모서리 드래그로 크기 조절, 이름 더블클릭으로 변경
                    </span>
                  </span>
                ) : (
                  <span style={{ fontSize: 15, color: "#fff" }}>
                    가구를 드래그해서 배치하거나 클릭하여 크기 조절 가능
                  </span>
                )}
                <button
                  onClick={enterCompareMode}
                  style={{
                    marginLeft: "auto",
                    background: "#0A1E3A",
                    border: "1px solid #1A4A7A",
                    borderRadius: 7,
                    color: "#5A9AD4",
                    padding: "6px 14px",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#112A4A")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#0A1E3A")
                  }
                >
                  ⊞ As-Is / To-Be 비교 (예정)
                </button>
              </>
            )}
          </div>

          {/* 캔버스 */}
          <div
            style={{
              flex: 1,
              overflow: "auto",
              padding: 24,
              display: "flex",
              gap: 0,
              alignItems: "flex-start",
            }}
          >
            {compareMode ? (
              <div
                style={{ display: "flex", gap: 0, alignItems: "flex-start" }}
              >
                {/* As-Is */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      marginBottom: 10,
                      padding: "3px 16px",
                      borderRadius: 20,
                      background: "#1A1A2E",
                      border: "1px solid #3A3A5A",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#7A7AAA",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    AS-IS
                  </div>
                  <RoomCanvas
                    items={items}
                    sections={sections}
                    setItems={setItems}
                    setSections={setSections}
                    selItemId={null}
                    setSelItemId={() => {}}
                    selSectionId={null}
                    setSelSectionId={() => {}}
                    catalogDrag={null}
                    setCatalogDrag={() => {}}
                    readonly={true}
                  />
                </div>
                <div
                  style={{
                    width: 2,
                    background:
                      "linear-gradient(to bottom, transparent, #3A3A5A, transparent)",
                    margin: "36px 20px 0",
                    alignSelf: "stretch",
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                />
                {/* To-Be */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      marginBottom: 10,
                      padding: "3px 16px",
                      borderRadius: 20,
                      background: "#0A2A18",
                      border: "1px solid #2A6A40",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#4A9A6A",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    TO-BE ✏️
                  </div>
                  <RoomCanvas
                    items={tobeItems}
                    sections={tobeSections}
                    setItems={setTobeItems}
                    setSections={setTobeSections}
                    selItemId={tobeSelItemId}
                    setSelItemId={setTobeSelItemId}
                    selSectionId={tobeSelSectionId}
                    setSelSectionId={setTobeSelSectionId}
                    catalogDrag={tobeCatalogDrag}
                    setCatalogDrag={setTobeCatalogDrag}
                    readonly={false}
                  />
                </div>
              </div>
            ) : (
              <RoomCanvas
                items={items}
                sections={sections}
                setItems={setItems}
                setSections={setSections}
                selItemId={selItemId}
                setSelItemId={setSelItemId}
                selSectionId={selSectionId}
                setSelSectionId={setSelSectionId}
                catalogDrag={catalogDrag}
                setCatalogDrag={setCatalogDrag}
                readonly={false}
              />
            )}
          </div>
        </div>

        {/*  우측 패널  */}
        {/* <StatsPanel
          items={items}
          sections={sections}
          trashList={trashList}
          compareMode={compareMode}
          tobeItems={tobeItems}
        /> */}
      </div>
    </>
  );
}
