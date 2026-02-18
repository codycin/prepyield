//Custom hook for managing entries in local storage
import { useLocalStorageState } from "./UseLocalStorageState";
import type { Unit } from "../utils/units";

export type Entry = {
  id: string;
  createdAt: string;
  foodId: string;
  foodName: string;
  rawWeight: number;
  cookedWeight: number;
  unit?: Unit;
  yieldPct: number;
};

const STORAGE_KEY = "rwcalc.entries.v1";

export function useEntries() {
  return useLocalStorageState<Entry[]>(STORAGE_KEY, []);
}
