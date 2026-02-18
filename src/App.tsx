import Home from "./pages/Home";
import EntryPage from "./pages/EntryPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import { useLocalStorageState } from "./hooks/UseLocalStorageState";

export default function App() {
  //Dark mode state is managed at the top level to ensure consistent styling across all pages and components.
  const [darkMode, setDarkMode] = useLocalStorageState("prepyield.dark", false);

  return (
    <div>
      <div
        className={
          darkMode
            ? "bg-dark text-light min-vh-100"
            : "bg-light text-dark min-vh-100"
        }
      >
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} />} />
          <Route path="/entries" element={<EntryPage darkMode={darkMode} />} />
        </Routes>
        <Footer darkMode={darkMode} />
      </div>
    </div>
  );
}
