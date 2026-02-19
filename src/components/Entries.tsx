{
  /*Entries component: Main component for the entry page. Utilizes browser 
    storage. Implemented input saftey. Helper functions for extra information.*/
}
import { useMemo, useState } from "react";
import { useEntries, type Entry } from "../hooks/useEntries";
import { ozToG, gToOz } from "../utils/units";
import { useUnit } from "../hooks/useUnits";
import UnitToggle from "./UnitToggle";

{
  /*Food type and list, plus helper functions for parsing and calculations*/
}
type Food = { id: string; name: string; note?: string };

//Parses a string to a positive number, returns NaN if invalid.
//Used for input fields to ensure only valid positive numbers are processed.
function parsePosNumber(s: string): number {
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

//Computes yield and related metrics from raw and cooked weights

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

//Dark mode prop for styling, passed from parent component
type EntriesProps = {
  darkMode: boolean;
};

export default function Entries({ darkMode }: EntriesProps) {
  //For entry local list
  const [entries, setEntries] = useEntries();

  //For input strings
  const [foodId, setFoodId] = useState("");
  const [rawStr, setRawStr] = useState("");
  const [cookedStr, setCookedStr] = useState("");

  //List of foods
  const foods: Food[] = useMemo(
    () => [
      { id: "chicken_breast", name: "Chicken Breast" },
      { id: "chicken_thigh", name: "Chicken Thigh" },
      { id: "cod", name: "Cod" },

      { id: "ground_beef_80_20", name: "Ground Beef (80/20)" },
      { id: "ground_beef_85_15", name: "Ground Beef (85/15)" },
      { id: "ground_beef_90_10", name: "Ground Beef (90/10)" },
      { id: "ground_beef_93_7", name: "Ground Beef (93/7)" },
      { id: "ground_beef_96_4", name: "Ground Beef (96/4)" },

      { id: "ground_chicken", name: "Ground Chicken" },

      { id: "ground_turkey_93_7", name: "Ground Turkey (93/7)" },
      { id: "ground_turkey_96_4", name: "Ground Turkey (96/4)" },

      { id: "ham", name: "Ham" },
      { id: "noodles", name: "Noodles" },
      { id: "other", name: "Other" },

      { id: "pork_chop", name: "Pork Chop" },
      { id: "pork_loin", name: "Pork Loin" },
      { id: "pork_tenderloin", name: "Pork Tenderloin" },

      { id: "potato", name: "Potato" },
      { id: "rice", name: "Rice" },

      { id: "salmon", name: "Salmon" },
      { id: "shrimp", name: "Shrimp" },
      { id: "steak", name: "Steak" },
      { id: "sweet_potato", name: "Sweet Potato" },

      { id: "tilapia", name: "Tilapia" },
      { id: "tuna", name: "Tuna" },

      { id: "turkey_breast", name: "Turkey Breast" },
    ],
    [],
  );

  //For food search input
  const [foodQuery, setFoodQuery] = useState(
    foods.find((f) => f.id === foodId)?.name ?? "",
  );
  //For controlling food dropdown visibility
  const [foodOpen, setFoodOpen] = useState(false);

  //Filter foods based on search query, limit results for performance and usability
  const filteredFoods = useMemo(() => {
    const q = foodQuery.trim().toLowerCase();

    // When nothing is typed, show more items
    if (!q) {
      return foods.slice(0, 30);
    }

    // When searching, limit results
    return foods.filter((f) => f.name.toLowerCase().includes(q)).slice(0, 8);
  }, [foodQuery, foods]);

  //Get the selected food object based on foodId, default to first food if not found
  const selectedFood = useMemo(() => {
    return foods.find((f) => f.id === foodId) ?? foods[0];
  }, [foods, foodId]);

  //Parse to numbers
  const rawWeight = parsePosNumber(rawStr);
  const cookedWeight = parsePosNumber(cookedStr);

  //Unit state and toggle, default to grams
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

  //Add a new entry to the list with computed results, then clear inputs
  const addEntry = () => {
    if (!Number.isFinite(rawWeight) || !Number.isFinite(cookedWeight)) return;

    const rawG = unit === "g" ? rawWeight : ozToG(rawWeight);
    const cookedG = unit === "g" ? cookedWeight : ozToG(cookedWeight);
    const { yieldPct } = computeYield(rawG, cookedG);

    const newEntry: Entry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      foodId,
      foodName: selectedFood.name,
      rawWeight: rawG,
      cookedWeight: cookedG,
      unit,
      yieldPct,
    };

    setEntries((prev) => [newEntry, ...prev]);

    setRawStr("");
    setCookedStr("");
    setFoodQuery("");
  };

  //Delete an entry by filtering it out of the list based on its unique ID
  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  //Clear all entries from the list, effectively resetting the stored data
  const clearAll = () => {
    setEntries([]);
  };

  return (
    <div
      className={`container py-4 ${
        darkMode
          ? "bg-dark text-light min-vh-100"
          : "bg-light text-dark min-vh-100"
      }`}
    >
      <h1 className="h3 mb-3 fw-semibold">Entries</h1>
      <div className="col-12 col-md-8 col-lg-6 mx-auto">
        {/* Inputs */}
        <div
          className={`card shadow-sm mb-3 ${
            darkMode ? "bg-secondary text-light border-light" : ""
          }`}
        >
          {" "}
          <div className="card-body">
            {/*Input fields for food selection, raw weight, and cooked weight, with a live preview of results*/}
            <div className="row g-2">
              <div className="col-12 col-md-4">
                <label className="form-label">Food</label>
                <div className="position-relative">
                  <input
                    className={`form-control ${
                      darkMode ? "bg-dark text-light border-secondary" : ""
                    }`}
                    //Controlled input for food search, updates query and controls dropdown visibility
                    value={foodQuery}
                    placeholder="Search foods…"
                    onChange={(e) => {
                      setFoodQuery(e.target.value);
                      setFoodOpen(true);
                    }}
                    onFocus={() => setFoodOpen(true)}
                    onBlur={() => setTimeout(() => setFoodOpen(false), 120)}
                  />

                  {foodOpen && (
                    <div
                      className="list-group position-absolute w-100 shadow-sm"
                      style={{ zIndex: 10, maxHeight: 240, overflowY: "auto" }}
                    >
                      {
                        //Check if theres any foods upon search, if not show "no matches"
                        filteredFoods.length === 0 ? (
                          <div className="list-group-item text-muted small">
                            No matches
                          </div>
                        ) : (
                          //Map filtered foods to buttons in the dropdown, clicking a button selects the food and closes the dropdown
                          filteredFoods.map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              className="list-group-item list-group-item-action"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                setFoodId(f.id);
                                setFoodQuery(f.name);
                                setFoodOpen(false);
                              }}
                            >
                              {f.name}
                            </button>
                          ))
                        )
                      }
                    </div>
                  )}
                </div>
              </div>
              {/*Input fields for raw and cooked weights, styled based on dark mode, and controlled by state variables. 
              Changes to these inputs update the corresponding state, which in turn updates the live preview of results.*/}
              <div className="col-12 col-md-4">
                <label className="form-label">Raw weight ({unit})</label>
                <input
                  className={`form-control ${
                    darkMode ? "bg-dark text-light border-secondary" : ""
                  }`}
                  value={rawStr}
                  onChange={(e) => setRawStr(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label">Cooked weight ({unit})</label>
                <input
                  className={`form-control ${
                    darkMode ? "bg-dark text-light border-secondary" : ""
                  }`}
                  value={cookedStr}
                  onChange={(e) => setCookedStr(e.target.value)}
                />
              </div>
            </div>
            {/*Buttons for adding an entry, clearing inputs, toggling units, and clearing all entries.
            The "Add entry" button is disabled until valid inputs are provided. 
            The "Clear all saved" button is disabled when there are no entries to clear.*/}
            <div className="d-flex gap-2 mt-2">
              <button
                className="btn btn-primary"
                onClick={addEntry}
                disabled={!currentResults}
              >
                Add entry
              </button>

              <button
                className={`btn btn-outline-secondary ${
                  darkMode ? "bg-secondary text-light border-light" : ""
                }`}
                onClick={() => {
                  setRawStr("");
                  setCookedStr("");
                }}
              >
                Clear inputs
              </button>
              <UnitToggle unit={unit} setUnit={setUnit} darkMode={darkMode} />
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
                <div className="alert alert-secondary mb-0">
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
        <div
          className={`card shadow-sm mb-3 ${
            darkMode ? "bg-secondary text-light border-light" : ""
          }`}
        >
          <div className="card-body">
            <h2 className="h5 mb-3">Saved entries</h2>

            {
              //If there are no entries, show a message prompting the user to add one.
              // Otherwise, display the entries in a responsive table with options to delete individual entries.
              entries.length === 0 ? (
                <div className="text-muted">
                  No saved entries yet. Add one above.
                </div>
              ) : (
                <div className="table-responsive">
                  <table
                    className={`table align-middle ${darkMode ? "table-dark " : ""}`}
                  >
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Food</th>
                        <th className="text-end">Raw (g)</th>
                        <th className="text-end">Cooked (g)</th>
                        <th className="text-end">Yield %</th>

                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((e) => {
                        const entryUnit = e.unit ?? "g";

                        const rawDisplay =
                          entryUnit === "g" ? e.rawWeight : gToOz(e.rawWeight);

                        const cookedDisplay =
                          entryUnit === "g"
                            ? e.cookedWeight
                            : gToOz(e.cookedWeight);

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

                            <td className="text-end">
                              {rawDisplay.toFixed(1)}
                              {entryUnit}
                            </td>

                            <td className="text-end">
                              {cookedDisplay.toFixed(1)}
                              {entryUnit}
                            </td>
                            <td className="text-end">
                              {e.yieldPct?.toFixed(1)}%
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
              )
            }

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
