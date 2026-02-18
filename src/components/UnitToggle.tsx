import type { Unit } from "../utils/units";

export default function UnitToggle({
  unit,
  setUnit,
}: {
  unit: Unit;
  setUnit: (u: Unit) => void;
}) {
  return (
    <button
      type="button"
      className={`btn btn-sm btn-outline-secondary `}
      onClick={() => setUnit(unit === "g" ? "oz" : "g")}
    >
      {unit === "g" ? "g" : "oz"}
    </button>
  );
}
