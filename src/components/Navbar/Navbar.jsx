import { Link, useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  return (
    <header className="navbar-wrapper">
      <nav className="navbar container">
        <Link to="/" className="logo">
          <div className="logo-icon">🤖</div>
          <span>
            Campus<text className="logo-blue" inline>Copilot</text>
          </span>
        </Link>

        <div className="nav-links">
          <Link className={location.pathname === "/" ? "active" : ""} to="/">
            Home
          </Link>

          <Link className={location.pathname === "/chat" ? "active" : ""} to="/chat">
            Chat
          </Link>

          <Link className={location.pathname === "/notices" ? "active" : ""} to="/notices">
            Notices
          </Link>

          <Link className={location.pathname === "/about" ? "active" : ""} to="/about">
            About
          </Link>
        </div>

        <Link to="/chat" className="ask-btn">
          Ask Anything
        </Link>

        <button className="menu-btn">
          <FiMenu />
        </button>
      </nav>
    </header>
  );
}

export default Navbar;