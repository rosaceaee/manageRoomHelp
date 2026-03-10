import { useState, useRef } from "react";
import { CELL_PX, BOARD_W, STATUS_CONFIG } from "../../constants";
import type { FurnitureItemData } from "../../types";

interface TodoPanelProps {
  item: FurnitureItemData;
  onUpdate: (item: FurnitureItemData) => void;
}

export function TodoPanel({ item, onUpdate }: TodoPanelProps) {
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const panelW = 350;
  const boardPxW = BOARD_W * CELL_PX;
  const spaceRight = boardPxW - (item.gx * CELL_PX + item.w * CELL_PX);
  const showLeft = spaceRight < panelW + 16;
  const panelLeft = showLeft ? -(panelW + 10) : item.w * CELL_PX + 10;

  const todos = item.todos ?? [];

  const addTodo = () => {
    const text = inputVal.trim();
    if (!text) return;
    onUpdate({
      ...item,
      todos: [
        ...todos,
        { id: Date.now(), text, status: "undecided", memo: "" },
      ],
    });
    setInputVal("");
    inputRef.current?.focus();
  };

  const updateTodo = (id: number, patch: Partial<(typeof todos)[0]>) => {
    onUpdate({
      ...item,
      todos: todos.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    });
  };

  const deleteTodo = (id: number) => {
    onUpdate({ ...item, todos: todos.filter((t) => t.id !== id) });
  };

  const cycleStatus = (id: number) => {
    const order = ["undecided", "keep", "trash"] as const;
    const todo = todos.find((t) => t.id === id)!;
    const next = order[(order.indexOf(todo.status) + 1) % order.length];
    updateTodo(id, { status: next });
  };

  const trashCount = todos.filter((t) => t.status === "trash").length;
  const keepCount = todos.filter((t) => t.status === "keep").length;

  return (
    <section
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={{
        left: panelLeft,
        width: panelW,
      }}
      className="modal"
    >
      {/* Modal -  furniture selected */}
      {/* Header */}
      <div className="head">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 14 }}>{item.icon}</span>
          <h4 style={{ fontWeight: 700, color: "#D0D8F0" }}>{item.label}</h4>
        </div>
        <div className="chip-wrap">
          {trashCount > 0 && (
            <span className="chip delete">버릴 것 {trashCount}</span>
          )}
          {keepCount > 0 && <span className="chip keep">유지 {keepCount}</span>}
          {/* {todos.length === 0 && (
            <span className="txt-teian">아래에서 항목을 추가해보세요</span>
          )} */}
        </div>
      </div>

      <div style={{ maxHeight: 300, overflowY: "auto", padding: "6px 0" }}>
        {todos.length === 0 ? (
          <div className="msg-none">
            아직 항목이 없어요
            <span className="txt-teian">아래에서 항목을 추가해보세요</span>
          </div>
        ) : (
          todos.map((todo) => {
            const cfg = STATUS_CONFIG[todo.status];
            return (
              <div key={todo.id} className="lists">
                <div className="inner">
                  <button
                    onClick={() => cycleStatus(todo.id)}
                    style={{
                      background: cfg.bg,
                      border: `1px solid ${cfg.border}`,
                      color: cfg.color,
                    }}
                    className="label"
                  >
                    {cfg.label}
                  </button>
                  <span
                    style={{
                      flex: 1,
                      wordBreak: "break-all",
                    }}
                    className="txt"
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="btn-del"
                  >
                    ×
                  </button>
                </div>

                <input
                  value={todo.memo}
                  onChange={(e) =>
                    updateTodo(todo.id, { memo: e.target.value })
                  }
                  placeholder="예) 낡음, 불필요..."
                  className="input memo"
                />
              </div>
            );
          })
        )}
      </div>

      {/* Add input */}
      <div className="add-wrap">
        <input
          ref={inputRef}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) addTodo();
          }}
          placeholder="항목 추가..."
          className="add-txt-input"
        />
        <button onClick={addTodo} className="btn-add">
          +
        </button>
      </div>
    </section>
  );
}
