import { useState } from "react";
import { SECTION_COLORS } from "../../constants";
import { newId } from "../../utils/id";
import type { RoomSection } from "../../types";

interface SetupModalProps {
  onComplete: (result: { roomType: string; sections: RoomSection[] }) => void;
}

export function SetupModal({ onComplete }: SetupModalProps) {
  const [step, setStep] = useState(1);
  const [roomType, setType] = useState<string | null>(null);
  const [names, setNames] = useState(["내 방"]);

  const pickType = (t: string) => {
    setType(t);
    setNames(t === "one" ? ["내 방"] : ["침실", "거실"]);
    setStep(2);
  };

  const finish = () => {
    if (!roomType) return;
    const sections: RoomSection[] = names.map((name, i) => ({
      id: newId(),
      name,
      gx: i === 0 ? 1 : 18,
      gy: 1,
      w: 14,
      h: 13,
    }));
    onComplete({ roomType, sections });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        background: "rgba(6,10,22,0.94)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#141E38",
          border: "1px solid #253450",
          borderRadius: 18,
          padding: "40px 44px",
          width: 460,
          boxShadow: "0 28px 80px rgba(0,0,0,0.7)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🏠</div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#E8E4DC",
              letterSpacing: "-0.02em",
            }}
          >
            방 배치 플래너
          </div>
          <h4 style={{ fontSize: 12, color: "#4A6A8A", marginTop: 4 }}>
            방에 있는 가구와 물건을 관리할 수 있습니다.
          </h4>
          <h4 style={{ fontSize: 12, color: "rgb(131 159 93)", marginTop: 4 }}>
            현재 데스크탑만 사용가능합니다.
          </h4>
        </div>

        {step === 1 && (
          <>
            <p
              style={{
                fontSize: 13,
                color: "#7A9AB4",
                textAlign: "center",
                marginBottom: 18,
              }}
            >
              거주하는 집 유형을 선택해주세요.
            </p>
            <div style={{ display: "flex", gap: 14 }}>
              {[
                { k: "one", emoji: "☝️", title: "원룸" },
                {
                  k: "two",
                  emoji: " ✌️",
                  title: "투룸+",
                },
              ].map((o) => (
                <button
                  key={o.k}
                  onClick={() => pickType(o.k)}
                  style={{
                    flex: 1,
                    padding: "22px 12px",
                    background: "#0D1B2E",
                    border: "1px solid #253450",
                    borderRadius: 14,
                    cursor: "pointer",
                    color: "#E8E4DC",
                    textAlign: "center",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "#4A7AAA")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "#253450")
                  }
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{o.emoji}</div>
                  <div
                    style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}
                  >
                    {o.title}
                  </div>
                  {/* <div style={{ fontSize: 11, color: "#4A6A8A" }}>{o.desc}</div> */}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p
              style={{
                fontSize: 13,
                color: "#7A9AB4",
                textAlign: "center",
                marginBottom: 18,
              }}
            >
              관리할 방 이름을 입력해주세요. (추후 변경 가능)
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 22,
              }}
            >
              {names.map((n, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      flexShrink: 0,
                      background: SECTION_COLORS[i % 3].bg,
                      border: `1px solid ${SECTION_COLORS[i % 3].border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      color: SECTION_COLORS[i % 3].label,
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </div>
                  <input
                    value={n}
                    onChange={(e) =>
                      setNames((p) =>
                        p.map((x, j) => (j === i ? e.target.value : x))
                      )
                    }
                    style={{
                      flex: 1,
                      background: "#0D1B2E",
                      border: "1px solid #253450",
                      borderRadius: 8,
                      color: "#E8E4DC",
                      padding: "10px 14px",
                      fontSize: 14,
                      outline: "none",
                    }}
                  />
                  {names.length > 1 && (
                    <button
                      onClick={() =>
                        setNames((p) => p.filter((_, j) => j !== i))
                      }
                      style={{
                        background: "#2A0D0D",
                        border: "1px solid #4A1A1A",
                        borderRadius: 6,
                        color: "#C06060",
                        padding: "6px 8px",
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {roomType === "two" && names.length < 4 && (
                <button
                  onClick={() =>
                    setNames((p) => [...p, `공간 ${p.length + 1}`])
                  }
                  style={{
                    background: "#0A2016",
                    border: "1px dashed #2A5A3A",
                    borderRadius: 8,
                    color: "#4A9A6A",
                    padding: "8px",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  + 공간 추가
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  padding: "11px",
                  background: "transparent",
                  border: "1px solid #253450",
                  borderRadius: 10,
                  color: "#5A7A9A",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                ← 뒤로
              </button>
              <button
                onClick={finish}
                style={{
                  flex: 2,
                  padding: "11px",
                  background: "#1A4A8A",
                  border: "1px solid #2A6AAA",
                  borderRadius: 10,
                  color: "#90CAF9",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 700,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#2A5A9A")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#1A4A8A")
                }
              >
                시작하기 →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
