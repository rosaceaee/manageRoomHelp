import { useState } from "react";
import { SECTION_COLORS } from "../../constants";
import { newId } from "../../utils/id";
import type { RoomSection } from "../../types";

interface SetupModalProps {
  onComplete: (result: { roomType: string; sections: RoomSection[] }) => void;
}

export function SetupModal({ onComplete }: SetupModalProps) {
  const [step, setStep] = useState(1);
  // const [roomType, setType] = useState<string | null>(null);
  const [roomType, setType] = useState<{
    k: string;
    emoji: string;
    title: string;
  } | null>(null);
  const [names, setNames] = useState(["내 방"]);

  const pickType = (o: { k: string; emoji: string; title: string }) => {
    setType(o);
    setNames(o.k === "one" ? ["내 방"] : ["침실", "거실"]);
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
    onComplete({ roomType: roomType.k, sections });
  };

  return (
    <section
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="wrap set"
    >
      <div
        style={{
          background: "#141E38",
          border: "1px solid #253450",
        }}
        className="info-wrap"
      >
        {/* Logo */}
        <div className="inner">
          <h1 className="tit">🏠 방 배치 플래너</h1>

          <div className="desc">
            <h4 className="txt">방에 있는 가구와 물건을 관리할 수 있습니다.</h4>
            <h4 className="txt">현재 데스크탑만 사용가능합니다.</h4>
          </div>
        </div>

        {step === 1 && (
          <>
            <div className="choose-wrap">
              <h1 className="tit">거주하는 집 유형을 선택해주세요.</h1>
              <div className="roombox-wrap">
                {[
                  { k: "one", emoji: "☝️", title: "원룸" },
                  {
                    k: "two",
                    emoji: " ✌️",
                    title: "투룸",
                  },
                ].map((o) => (
                  <button
                    key={o.k}
                    onClick={() => pickType(o)}
                    className="roomtype-btn"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "#4A7AAA")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "#253450")
                    }
                  >
                    <div style={{ fontSize: 32, marginBottom: 8 }}>
                      {o.emoji}
                    </div>
                    <div
                      style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}
                    >
                      {o.title}
                    </div>
                    {/* <div style={{ fontSize: 11, color: "#4A6A8A" }}>{o.desc}</div> */}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="roomtype-wrap">
              <h2 className="tit">
                {roomType?.title}
                {roomType?.emoji}
              </h2>
            </div>

            <div className="desc-wrap">
              <p className="desc">
                관리할 방 이름을 입력해주세요.
                {/* <br />
                (추후 변경 가능) */}
              </p>

              {roomType?.k === "two" && names.length < 4 && (
                <button
                  className="add-btn"
                  onClick={() =>
                    setNames((p) => [...p, `공간 ${p.length + 1}`])
                  }
                >
                  + 추가
                </button>
              )}
            </div>

            <div className="roomname-wrap">
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
                      className="del-btn"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="confirm-wrap">
              <button
                onClick={() => setStep(1)}
                style={{
                  color: "#5A7A9A",
                }}
                className="back-btn"
              >
                ← 뒤로
              </button>
              <button
                onClick={finish}
                style={{
                  background: "#1A4A8A",
                  color: "#90CAF9",
                }}
                className="confirm-btn"
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
    </section>
  );
}
