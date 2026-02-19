//Main page showing current entries and allowing the user to "use"
//some of an entry's cooked weight which will update or delete the entry accordingly.
import { useEntries } from "../hooks/useEntries";
import { useState } from "react";
import { gToOz } from "../utils/units";
import { NavLink } from "react-router-dom";
import { ozToG } from "../utils/units";

//For input
function parsePosNumber(s: string): number {
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

//Dark mode prop
type HeroProps = {
  darkMode: boolean;
};

export default function Hero({ darkMode }: HeroProps) {
  //For deleting entries and "using" entries
  const [entries, setEntries] = useEntries();

  //For tracking the "raw wanted" input for each entry in the table
  const [rawWantedById, setRawWantedById] = useState<Record<string, string>>(
    {},
  );

  //Use function that iterates through the entries and updates or deletes them
  //based on the "raw wanted" input and the entry's yield percentage.
  const useAllWithRaw = () => {
    setEntries((prev) => {
      const next: typeof prev = [];

      for (const e of prev) {
        const id = String(e.id);

        const rawWantedStr = rawWantedById[id] ?? "";
        const rawWanted = parsePosNumber(rawWantedStr);

        if (!Number.isFinite(rawWanted) || rawWanted <= 0) {
          next.push(e);
          continue;
        }

        const yieldRate = e.yieldPct / 100;
        if (!Number.isFinite(yieldRate) || yieldRate <= 0) {
          next.push(e);
          continue;
        }

        const entryUnit = e.unit ?? "g";
        const rawWantedG = entryUnit === "oz" ? ozToG(rawWanted) : rawWanted;

        const cookedNeededG = rawWantedG * yieldRate;
        if (!Number.isFinite(cookedNeededG) || cookedNeededG <= 0) {
          next.push(e);
          continue;
        }

        const amountToUseG = Math.min(cookedNeededG, e.cookedWeight);
        const newCookedG = e.cookedWeight - amountToUseG;

        if (newCookedG > 0) {
          next.push({ ...e, cookedWeight: newCookedG });
        }
      }

      return next;
    });

    //clear only the raw inputs that were used
    setRawWantedById((prev) => {
      const next = { ...prev };
      for (const [id, rawStr] of Object.entries(prev)) {
        const n = parsePosNumber(rawStr);
        if (Number.isFinite(n) && n > 0) delete next[id];
      }
      return next;
    });
  };

  const anyRawFilled = Object.values(rawWantedById).some((s) =>
    Number.isFinite(parsePosNumber(s)),
  );

  return (
    <div className={`container py-4 ${darkMode ? "bg-dark text-light" : ""}`}>
      <h1 className="h3 mb-3 fw-semibold">Current Entries</h1>
      <div className="col-12 col-md-10 col-lg-6 mx-auto">
        <div
          className={`card shadow-sm mb-3 ${
            darkMode ? "bg-secondary text-light border-light" : ""
          }`}
        >
          <div className="card-body">
            {
              //If there are no entries, show a call to action to add some.
              // Otherwise show the table of entries.
              entries.length === 0 ? (
                <div className="text-muted">
                  <NavLink to="/entries" className="text-decoration-none">
                    <button
                      className={`btn btn-lg ${darkMode ? "btn-dark text-light" : "btn-light btn-outline-dark"}`}
                    >
                      Click here to add an Entry!
                    </button>
                  </NavLink>
                </div>
              ) : (
                //Table of entries with inputs for "raw wanted" and buttons to "use" the calculated cooked needed amount.
                <div className="table-responsive">
                  <div className="d-flex justify-content-end mb-2">
                    <button
                      className={`btn btn-sm btn-outline-secondary ${
                        darkMode ? "text-light border-light" : ""
                      }`}
                      onClick={useAllWithRaw}
                      disabled={!anyRawFilled || entries.length === 0}
                    >
                      Use
                    </button>
                  </div>
                  <table
                    className={`table table-sm align-middle text-nowrap ${
                      darkMode ? "table-dark" : ""
                    }`}
                  >
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Food</th>
                        <th>Total</th>
                        <th className="text-start">Raw</th>
                        <th>Cooked</th>
                      </tr>
                    </thead>

                    <tbody>
                      {
                        //For each entry, calculate the cooked needed based on the raw wanted input and the entry's yield percentage.
                        entries.map((e) => {
                          const id = String(e.id);
                          const rawWantedStr = rawWantedById[id] ?? "";
                          const rawWanted = parsePosNumber(rawWantedStr);
                          const yieldRate = e.yieldPct / 100;

                          const cookedNeeded =
                            Number.isFinite(rawWanted) &&
                            rawWanted > 0 &&
                            Number.isFinite(yieldRate) &&
                            yieldRate > 0
                              ? rawWanted * yieldRate
                              : null;

                          const entryUnit = e.unit ?? "g";

                          const cookedDisplay =
                            entryUnit === "g"
                              ? e.cookedWeight
                              : gToOz(e.cookedWeight);
                          //Render the table row for this entry, with the "use" button disabled if the cooked needed cannot be calculated.
                          return (
                            <tr key={e.id}>
                              <td
                                className={`${darkMode ? "text-light small" : "text-muted small"}`}
                              >
                                {new Date(e.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "2-digit",
                                    day: "2-digit",
                                  },
                                )}
                              </td>

                              <td>{e.foodName}</td>
                              <td>
                                {cookedDisplay.toFixed(1)}
                                {entryUnit}
                              </td>

                              <td>
                                <input
                                  className={`form-control form-control-sm ${
                                    darkMode
                                      ? "bg-dark text-light border-secondary"
                                      : ""
                                  }`}
                                  style={{ width: "44px", padding: "2px 6px" }}
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

                              <td>
                                {cookedNeeded == null
                                  ? "—"
                                  : cookedNeeded.toFixed(2)}
                                {entryUnit}
                              </td>
                            </tr>
                          );
                        })
                      }
                    </tbody>
                  </table>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
}
