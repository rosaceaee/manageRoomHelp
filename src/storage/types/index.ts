export type TodoStatus = "undecided" | "keep" | "trash";

export interface TodoItem {
  id: number;
  text: string;
  status: TodoStatus;
  memo: string;
}

export interface FurnitureItemData {
  id: number;
  type: string;
  label: string;
  icon: string;
  color: string;
  w: number;
  h: number;
  gx: number;
  gy: number;
  rotation: number;
  note: string;
  todos: TodoItem[];
}

export interface RoomSection {
  id: number;
  name: string;
  gx: number;
  gy: number;
  w: number;
  h: number;
}

export interface TrashItem extends FurnitureItemData {
  trashId: number;
}

export interface CatalogItem {
  type: string;
  label: string;
  icon: string;
  color: string;
  w: number;
  h: number;
}

export interface CatalogDrag extends CatalogItem {
  gx: number;
  gy: number;
}

export interface SectionColorScheme {
  bg: string;
  border: string;
  label: string;
}

export interface PersistedState {
  items: FurnitureItemData[];
  sections: RoomSection[];
  trashList: TrashItem[];
  customCatalog: CatalogItem[];
  nextUid: number;
}
