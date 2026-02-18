import Home from "./pages/Home";
import EntryPage from "./pages/EntryPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";

export default function App() {
  //Dark mode state is managed at the top level to ensure consistent styling across all pages and components.
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div>
      <div
        className={
          darkMode
            ? "bg-dark text-light min-vh-100"
            : "bg-light text-dark min-vh-100"
        }
      >
        <button //Dark mode toggle button is fixed in the bottom right corner for easy access on all pages.
          className="btn btn-outline-secondary position-fixed bottom-0 end-0 m-3"
          onClick={() => setDarkMode((d) => !d)}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <Header />
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} />} />
          <Route path="/entries" element={<EntryPage darkMode={darkMode} />} />
        </Routes>
        <Footer darkMode={darkMode} />
      </div>
    </div>
  );
}
