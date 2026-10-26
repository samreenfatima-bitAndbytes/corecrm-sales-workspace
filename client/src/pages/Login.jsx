import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BrandLogo } from "../components/BrandLogo";
import PasswordField from "../components/PasswordField";
import { DEMO_USERS, ROLE_HOME } from "../data/demo";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_USERS[0].email);
  const [password, setPassword] = useState(DEMO_USERS[0].password);
  const [activeDemo, setActiveDemo] = useState(DEMO_USERS[0].role);
  const [error, setError] = useState("");

  if (user) return <Navigate to={ROLE_HOME[user.role] || "/app/home"} replace />;

  const pick = (acct) => {
    setActiveDemo(acct.role);
    setEmail(acct.email);
    setPassword(acct.password);
    setError("");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    navigate(ROLE_HOME[res.user.role] || "/app/home");
  };

  const label = {
    admin: "Admin",
    salesmanager: "Sales Manager",
    sales: "Sales",
    viewer: "Viewer",
  };

  return (
    <div className="login-page">
      <div className="login-shell">
        <section className="login-hero">
          <BrandLogo className="login-hero__logo" />
          <h1>Close pipeline with a quieter, sharper CRM</h1>
          <p>
            Premium role-based workspace for admins, managers, and reps —
            qualify leads, run companies, and move deals without the noise.
          </p>
          <ul className="login-hero__points">
            <li>
              <span>✓</span> Distinct menus per Admin, Manager, Sales, Viewer
            </li>
            <li>
              <span>✓</span> Admin manages users; Sales sees only own leads
            </li>
            <li>
              <span>✓</span> Qualify → companies → deals for Manager / Admin
            </li>
          </ul>
        </section>

        <form className="login-card" onSubmit={onSubmit}>
          <div className="login-card__head">
            <h2>Sign in</h2>
            <p>Pick a demo role — credentials fill automatically.</p>
          </div>

          <div className="demo-chips" role="group" aria-label="Demo accounts">
            {DEMO_USERS.map((acct) => (
              <button
                key={acct.email}
                type="button"
                className={activeDemo === acct.role ? "is-active" : undefined}
                onClick={() => pick(acct)}
              >
                {label[acct.role]}
              </button>
            ))}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <PasswordField
              id="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "0.25rem", padding: "0.8rem" }}
          >
            Continue to workspace
          </button>
        </form>
      </div>
    </div>
  );
}
