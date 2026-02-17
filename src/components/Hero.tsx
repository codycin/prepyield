import { useEntries, type Entry } from "../hooks/useEntries";
import { useMemo, useState } from "react";

export default function Hero() {
  const [entries, setEntries] = useEntries();

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="text-center">
      <h1 className="display-4">Welcome</h1>
      <p className="lead">Bootstrap + custom CSS</p>
      <button className="btn btn-primary">Get Started</button>
      {entries.map((e) => {
        return (
          <tr key={e.id}>
            <td className="text-muted small">
              {new Date(e.createdAt).toLocaleString()}
            </td>
            <td>{e.foodName}</td>
            <td className="text-end">{e.rawWeight}</td>
            <td className="text-end">{e.cookedWeight}</td>

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
    </div>
  );
}
