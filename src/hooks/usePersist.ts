import { useEffect, useState, useCallback } from "react";
import { STORAGE_KEY } from "../constants";
import type { PersistedState } from "../types";

function persistSave(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function persistLoad(): PersistedState | null {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

function exportJSON(state: PersistedState) {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `room-planner-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function importJSON(onLoad: (state: PersistedState) => void) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        onLoad(JSON.parse(ev.target?.result as string));
      } catch {
        alert("파일을 읽을 수 없어요. 올바른 JSON 파일인지 확인해주세요.");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

type FlashType = "saved" | "loaded" | null;

export function usePersist(
  state: PersistedState,
  onLoad: (s: PersistedState) => void
) {
  const [flash, setFlash] = useState<FlashType>(null);

  const showFlash = useCallback((type: FlashType) => {
    setFlash(type);
    setTimeout(() => setFlash(null), 2000);
  }, []);

  // Restore on mount
  useEffect(() => {
    const saved = persistLoad();
    if (saved) {
      onLoad(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save on every change
  useEffect(() => {
    if (!state.items.length && !state.sections.length) return;
    persistSave(state);
  }, [state]);

  const handleExport = useCallback(() => {
    exportJSON(state);
    showFlash("saved");
  }, [state, showFlash]);

  const handleImport = useCallback(() => {
    importJSON((data) => {
      onLoad(data);
      showFlash("loaded");
    });
  }, [onLoad, showFlash]);

  const handleClear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { flash, handleExport, handleImport, handleClear };
}
