import type { CatalogItem, SectionColorScheme } from "../types";

export const CELL_PX = 28;
export const BOARD_W = 60;
export const BOARD_H = 40;

export const STORAGE_KEY = "room-planner-v1";

export const FURNITURE_CATALOG: CatalogItem[] = [
  {
    type: "bed_single",
    label: "싱글 침대",
    w: 3,
    h: 5,
    color: "#5E7FA3",
    icon: "🛏",
  },
  {
    type: "bed_double",
    label: "더블 침대",
    w: 5,
    h: 6,
    color: "#4A6A8E",
    icon: "🛏",
  },
  { type: "desk", label: "책상", w: 4, h: 2, color: "#8B6914", icon: "🖥" },
  { type: "wardrobe", label: "옷장", w: 4, h: 2, color: "#7A6245", icon: "🚪" },
  { type: "sofa", label: "소파", w: 5, h: 2, color: "#7A6E99", icon: "🛋" },
  {
    type: "tv_stand",
    label: "TV 스탠드",
    w: 4,
    h: 1,
    color: "#555",
    icon: "📺",
  },
  {
    type: "bookshelf",
    label: "책장",
    w: 2,
    h: 4,
    color: "#8B6914",
    icon: "📚",
  },
  {
    type: "dining_table",
    label: "식탁",
    w: 3,
    h: 3,
    color: "#A0724A",
    icon: "🪑",
  },
  { type: "dresser", label: "서랍장", w: 3, h: 2, color: "#9A7A5A", icon: "🗄" },
  { type: "plant", label: "화분", w: 1, h: 1, color: "#3D7A4A", icon: "🌿" },
  { type: "fridge", label: "냉장고", w: 2, h: 2, color: "#607080", icon: "🧊" },
  {
    type: "washing",
    label: "세탁기",
    w: 2,
    h: 2,
    color: "#5080A0",
    icon: "🌀",
  },
];

export const CUSTOM_ICONS: string[] = [
  "📦",
  "🪣",
  "🗃",
  "🖼",
  "🧴",
  "🪞",
  "🧺",
  "🪤",
  "🛒",
  "🗑",
  "💼",
  "🧲",
  "🪜",
  "🛁",
  "🚿",
  "🪠",
  "🖨",
  "🎒",
];

export const CUSTOM_COLORS: string[] = [
  "#6A7FA0",
  "#7A6A9A",
  "#6A9A7A",
  "#9A7A6A",
  "#9A6A6A",
  "#7A9A9A",
  "#8A8A6A",
  "#6A8A6A",
];

export const SECTION_COLORS: SectionColorScheme[] = [
  { bg: "rgba(91,155,213,0.10)", border: "#5B9BD5", label: "#7AB8E8" },
  { bg: "rgba(125,184,122,0.10)", border: "#7DB87A", label: "#9AD097" },
  { bg: "rgba(212,144,96,0.10)", border: "#D49060", label: "#ECA878" },
];

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  undecided: {
    label: "미정",
    color: "#8A8AAA",
    bg: "#1A1A2E",
    border: "#3A3A5A",
  },
  keep: { label: "유지", color: "#5ABB7A", bg: "#0A2018", border: "#1A5A30" },
  trash: {
    label: "버릴 것",
    color: "#EF9A9A",
    bg: "#2A1010",
    border: "#5A2020",
  },
};
