//Header component with responsive navbar and logo
import { NavLink } from "react-router-dom";
import logo from "../assets/icon.png";

type HeaderProps = {
  darkMode: boolean;
  setDarkMode: (v: boolean | ((prev: boolean) => boolean)) => void;
};

//Bootstrap's collapse component doesn't automatically close
// when a link is clicked so I added that functionality manually.
export default function Header({ darkMode, setDarkMode }: HeaderProps) {
  const closeNavbar = () => {
    const nav = document.getElementById("mainNav");
    if (nav && nav.classList.contains("show")) {
      const bsCollapse =
        (window as any).bootstrap.Collapse.getInstance(nav) ||
        new (window as any).bootstrap.Collapse(nav);
      bsCollapse.hide();
    }
  };

  return (
    <>
      {/* Background div to prevent content from showing through the transparent navbar on scroll. Always dark */}
      <div className="bg-dark" />
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid px-2">
          {/* Brand */}
          <NavLink
            to="/"
            className="navbar-brand d-flex align-items-center gap-2"
          >
            <div className="icon-wrap">
              <img
                src={logo}
                alt="Logo"
                height={32}
                className="icon img-fluid"
              />
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
            {/* Centered links (desktop) */}
            <div className="nav-center-lg">
              <ul className="navbar-nav gap-lg-3">
                <li className="nav-item">
                  <NavLink to="/" className="nav-link" onClick={closeNavbar}>
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/entries"
                    className="nav-link"
                    onClick={closeNavbar}
                  >
                    Entry
                  </NavLink>
                </li>
              </ul>
            </div>

            {/* Dark mode button – far right on desktop */}
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary ms-lg-auto mt-3 mt-lg-0"
              onClick={() => setDarkMode((d) => !d)}
            >
              {darkMode ? "Dark" : "Light"}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
