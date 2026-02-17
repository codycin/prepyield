import { NavLink } from "react-router-dom";
import logo from "../assets/icon.png"; // optional

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Brand */}
        <NavLink
          to="/"
          className="navbar-brand d-flex align-items-center gap-2"
        >
          <div className="icon-wrap">
            <img src={logo} alt="Logo" height={32} className="icon img-fluid" />
          </div>
          <span className="fw-semibold">PrepYield</span>
        </NavLink>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto gap-lg-3">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/entries" end className="nav-link">
                Entry
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
