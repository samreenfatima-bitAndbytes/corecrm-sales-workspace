import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { navForRole, ROLE_LABEL } from "../data/demo";
import { BrandLogo } from "./BrandLogo";
import { NAV_ICONS } from "./Icons";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { toast, resetDemo } = useData();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const role = user?.role || "viewer";
  const nav = navForRole(role);

  const hint =
    role === "admin"
      ? "Admin · users, full pipeline, payments oversight"
      : role === "salesmanager"
        ? "Sales Manager · all leads, companies, deals, qualify"
        : role === "sales"
          ? "Sales · your leads & tasks only"
          : "Viewer · read-only overview & leads";

  return (
    <div className="app-shell">
      {open ? (
        <button
          type="button"
          className="backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside className={`sidebar${open ? " is-open" : ""}`}>
        <div className="sidebar__brand">
          <BrandLogo className="sidebar__logo" />
        </div>

        <div className="sidebar__section">Workspace</div>
        <nav className="sidebar__nav" onClick={() => setOpen(false)}>
          {nav.map((item) => {
            const Icon = NAV_ICONS[item.id] || NAV_ICONS.dash;
            return (
              <NavLink
                key={item.id}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? "is-active" : undefined)}
              >
                <Icon />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar__user">
          <div className="meta">
            <div className="avatar">
              {(user?.name || "U").slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="name">{user?.name}</div>
              <div className="role">{ROLE_LABEL[role] || role}</div>
            </div>
          </div>
          <button type="button" className="btn btn-ghost" onClick={resetDemo}>
            Reset demo data
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="app-main">
        <div className="app-top">
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
          <div className="app-top__hint">{hint}</div>
        </div>
        <Outlet />
      </div>

      {toast ? <div className="toast">{toast}</div> : null}
    </div>
  );
}
