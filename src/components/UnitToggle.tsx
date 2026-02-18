//UnitToggle component for switching between grams and ounces.
//Also accounts for dark mode
import type { Unit } from "../utils/units";

type UnitToggleProps = {
  unit: Unit;
  setUnit: (u: Unit) => void;
  darkMode: boolean;
};

export default function UnitToggle({
  unit,
  setUnit,
  darkMode,
}: UnitToggleProps) {
  return (
    <button
      type="button"
      className={`btn btn-sm btn-outline-secondary ${
        darkMode ? "bg-secondary text-light border-light" : ""
      } `}
      onClick={() => setUnit(unit === "g" ? "oz" : "g")}
    >
      {unit === "g" ? "g" : "oz"}
    </button>
  );
}
