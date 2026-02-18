import { useEntries } from "../hooks/useEntries";
import { useState } from "react";
import { ozToG, gToOz } from "../utils/units";
import { useUnit } from "../hooks/useUnits";
import UnitToggle from "../components/UnitToggle";

function parsePosNumber(s: string): number {
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

export default function Hero() {
  const [entries, setEntries] = useEntries();

  const [rawWantedById, setRawWantedById] = useState<Record<string, string>>(
    {},
  );

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setRawWantedById((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <div className="container py-5">
      <h1 className="h2 mb-3">Current Entries</h1>

      <div className="col-12 col-md-10 col-lg-6 mx-auto">
        <div className="card shadow-sm mt-4">
          <div className="card-body">
            {entries.length === 0 ? (
              <div className="text-muted">
                No saved entries yet. Add on the entry page.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Food</th>
                      <th>Total</th>
                      <th className="text-start">Raw</th>
                      <th>Cooked</th>
                      <th />
                    </tr>
                  </thead>

                  <tbody>
                    {entries.map((e) => {
                      const id = String(e.id);

                      const rawWantedStr = rawWantedById[id] ?? "";
                      const rawWanted = parsePosNumber(rawWantedStr);

                      const cooked = Number((e as any).cookedWeight);
                      const raw = Number((e as any).rawWeight);

                      const yieldRate =
                        Number.isFinite(cooked) &&
                        Number.isFinite(raw) &&
                        raw > 0
                          ? cooked / raw
                          : NaN;

                      const cookedNeeded =
                        Number.isFinite(rawWanted) &&
                        rawWanted > 0 &&
                        Number.isFinite(yieldRate) &&
                        yieldRate > 0
                          ? rawWanted * yieldRate
                          : null;

                      const entryUnit = e.unit ?? "g"; // fallback for older entries

                      const cookedDisplay =
                        entryUnit === "g"
                          ? e.cookedWeight
                          : gToOz(e.cookedWeight);

                      const rawWantedG = Number.isFinite(rawWanted)
                        ? entryUnit === "g"
                          ? rawWanted
                          : ozToG(rawWanted)
                        : NaN;

                      return (
                        <tr key={e.id}>
                          <td className="text-muted small">
                            {new Date(e.createdAt).toLocaleDateString("en-US", {
                              month: "2-digit",
                              day: "2-digit",
                            })}
                          </td>

                          <td>{e.foodName}</td>
                          <td>
                            {cookedDisplay.toFixed(1)}
                            {e.unit}
                          </td>

                          <td>
                            <input
                              className="form-control form-control-sm"
                              style={{ width: "50px" }}
                              inputMode="decimal"
                              value={rawWantedStr}
                              onChange={(ev) =>
                                setRawWantedById((prev) => ({
                                  ...prev,
                                  [id]: ev.target.value,
                                }))
                              }
                            />
                          </td>

                          <td className="">
                            {cookedNeeded == null
                              ? "—"
                              : cookedNeeded.toFixed(1)}
                            {e.unit}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
