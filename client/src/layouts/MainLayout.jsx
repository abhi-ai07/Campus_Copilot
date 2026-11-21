import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiHome,
  FiMessageSquare,
  FiBell,
  FiInfo,
  FiPlus,
  FiMenu,
  FiX,
  FiHelpCircle,
  FiFileText,
} from "react-icons/fi";
import "./MainLayout.css";

function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/", icon: FiHome },
    { label: "Notices", path: "/notices", icon: FiBell },
    { label: "Documents", path: "/documents", icon: FiFileText },
    { label: "FAQ", path: "/faq", icon: FiHelpCircle },
    { label: "About", path: "/about", icon: FiInfo },
  ];

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="app-layout">
      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          aria-label="Close sidebar"
          onClick={closeSidebar}
        />
      )}

      <aside className={`app-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">✦</div>
          <span>
            Campus<span className="sidebar-brand-accent">Copilot</span>
          </span>

          <button
            className="sidebar-close"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>

        <NavLink to="/chat" className="sidebar-new-chat" onClick={closeSidebar}>
          <FiPlus />
          <span>New Chat</span>
        </NavLink>

        <div className="sidebar-section-label">MENU</div>

        <nav className="sidebar-nav">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-bottom-icon">C</div>
          <div>
            <p>CampusCopilot</p>
            <span>College Assistant</span>
          </div>
        </div>
      </aside>

      <div className="app-main">
        <header className="mobile-topbar">
          <button
            className="mobile-menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <FiMenu />
          </button>

          <span className="mobile-brand">
            Campus<span>Copilot</span>
          </span>

          <NavLink
            to="/chat"
            className="mobile-chat-link"
            aria-label="Open chat"
          >
            <FiMessageSquare />
          </NavLink>
        </header>

        <main className="app-page" key={location.pathname}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
