import { useMemo, useState } from "react";
import { useEntries, type Entry } from "../hooks/useEntries";
import { ozToG, gToOz } from "../utils/units";
import { useUnit } from "../hooks/useUnits";
import UnitToggle from "../components/UnitToggle";

type Food = { id: string; name: string; note?: string };

function parsePosNumber(s: string): number {
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function computeYield(raw: number, cooked: number) {
  const yieldFactor = cooked / raw;
  return {
    yieldFactor,
    yieldPct: yieldFactor * 100,
    lossPct: (1 - yieldFactor) * 100,
    cookedPerRaw: yieldFactor,
    rawPerCooked: raw / cooked,
    rawPer100Cooked: (raw / cooked) * 100,
  };
}

export default function EntryPage() {
  //For entry local list
  const [entries, setEntries] = useEntries();

  //For input strings
  const [foodId, setFoodId] = useState("chicken_breast");
  const [rawStr, setRawStr] = useState("");
  const [cookedStr, setCookedStr] = useState("");

  //For Food select
  const selectedFood = useMemo(() => {
    const foods: Food[] = [
      { id: "chicken_breast", name: "Chicken Breast" },
      { id: "rice", name: "Rice" },
      { id: "other", name: "Other" },
    ];
    return foods.find((f) => f.id === foodId) ?? foods[0];
  }, [foodId]);

  //Parse to numbers
  const rawWeight = parsePosNumber(rawStr);
  const cookedWeight = parsePosNumber(cookedStr);
  const { unit, setUnit } = useUnit("g");

  //Check selection validity and only update results when both are valid positive numbers
  const currentResults = useMemo(() => {
    if (!Number.isFinite(rawWeight) || !Number.isFinite(cookedWeight))
      return null;

    const rawG = unit === "g" ? rawWeight : ozToG(rawWeight);
    const cookedG = unit === "g" ? cookedWeight : ozToG(cookedWeight);

    if (!Number.isFinite(rawG) || !Number.isFinite(cookedG)) return null;
    return computeYield(rawG, cookedG);
  }, [rawWeight, cookedWeight, unit]);

  const addEntry = () => {
    if (!Number.isFinite(rawWeight) || !Number.isFinite(cookedWeight)) return;

    const rawG = unit === "g" ? rawWeight : ozToG(rawWeight);
    const cookedG = unit === "g" ? cookedWeight : ozToG(cookedWeight);

    const newEntry: Entry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      foodId,
      foodName: selectedFood.name,
      rawWeight: rawG,
      cookedWeight: cookedG,
      unit, // metadata: what the user entered in
    };

    setEntries((prev) => [newEntry, ...prev]);

    // optional: keep food selected, clear numbers
    setRawStr("");
    setCookedStr("");
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const clearAll = () => {
    setEntries([]);
  };

  return (
    <div className="container py-5">
      <h1 className="h2 mb-3">Entries</h1>
      <div className="col-12 col-md-8 col-lg-6 mx-auto">
        {/* Inputs */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <label className="form-label">Food selection</label>
                <select
                  className="form-select"
                  value={foodId}
                  onChange={(e) => setFoodId(e.target.value)}
                >
                  <option value="chicken_breast">Chicken Breast</option>
                  <option value="rice">Rice</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label">Raw weight ({unit})</label>
                <input
                  className="form-control"
                  value={rawStr}
                  onChange={(e) => setRawStr(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label">Cooked weight ({unit})</label>
                <input
                  className="form-control"
                  value={cookedStr}
                  onChange={(e) => setCookedStr(e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex gap-2 mt-3">
              <button
                className="btn btn-primary"
                onClick={addEntry}
                disabled={!currentResults}
              >
                Add entry
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setRawStr("");
                  setCookedStr("");
                }}
              >
                Clear inputs
              </button>
              <UnitToggle unit={unit} setUnit={setUnit} />
              <button
                className="btn btn-outline-danger ms-auto"
                onClick={clearAll}
                disabled={entries.length === 0}
              >
                Clear all saved
              </button>
            </div>

            {/* Live preview */}
            <div className="mt-3">
              {!currentResults ? (
                <div className="alert alert-warning mb-0">
                  Enter positive raw & cooked weights to preview results.
                </div>
              ) : (
                <div className="alert alert-secondary mb-0">
                  <div className="fw-semibold">Preview</div>
                  <div className="small">
                    Yield: {currentResults.yieldPct.toFixed(1)}% • Loss:{" "}
                    {currentResults.lossPct.toFixed(1)}% • Raw per 100g cooked:{" "}
                    {currentResults.rawPer100Cooked.toFixed(1)}g
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* History */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="h5 mb-3">Saved entries</h2>

            {entries.length === 0 ? (
              <div className="text-muted">
                No saved entries yet. Add one above.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Food</th>
                      <th className="text-end">Raw (g)</th>
                      <th className="text-end">Cooked (g)</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((e) => {
                      const entryUnit = e.unit ?? "g"; // fallback for older entries

                      const rawDisplay =
                        entryUnit === "g" ? e.rawWeight : gToOz(e.rawWeight);

                      const cookedDisplay =
                        entryUnit === "g"
                          ? e.cookedWeight
                          : gToOz(e.cookedWeight);

                      return (
                        <tr key={e.id}>
                          <td className="text-muted small">
                            {new Date(e.createdAt).toLocaleDateString("en-US", {
                              month: "2-digit",
                              day: "2-digit",
                            })}
                          </td>
                          <td>{e.foodName}</td>

                          <td className="text-end">
                            {rawDisplay.toFixed(1)}
                            {entryUnit}
                          </td>

                          <td className="text-end">
                            {cookedDisplay.toFixed(1)}
                            {entryUnit}
                          </td>

                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteEntry(e.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="text-muted small mt-2">
              Stored locally in your browser (localStorage). Clearing site data
              will remove it.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
