import Home from "./pages/Home";
import Entries from "./pages/Entries";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/entries" element={<Entries />} />
      </Routes>
    </div>
  );
}
