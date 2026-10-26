import { useState } from "react";
import Modal from "../components/Modal";
import { ROLE_LABEL } from "../data/demo";
import { useData } from "../hooks/useData";

const ROLE_OPTIONS = ["admin", "salesmanager", "sales", "viewer"];

export default function Users() {
  const { team, patch, notify } = useData();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "sales",
  });

  const submit = (e) => {
    e.preventDefault();
    const email = form.email.trim().toLowerCase();
    if (team.some((u) => u.email === email)) {
      notify("That email is already on the team");
      return;
    }
    patch("team", (list) => [
      {
        id: `u-${Date.now()}`,
        name: form.name.trim(),
        email,
        role: form.role,
        status: "Active",
      },
      ...list,
    ]);
    notify(`Invited ${form.name}`);
    setOpen(false);
    setForm({ name: "", email: "", role: "sales" });
  };

  const setRole = (id, role) => {
    patch("team", (list) =>
      list.map((u) => (u.id === id ? { ...u, role } : u))
    );
    notify("Role updated");
  };

  const setStatus = (id, status) => {
    patch("team", (list) =>
      list.map((u) => (u.id === id ? { ...u, status } : u))
    );
    notify(status === "Active" ? "User activated" : "User deactivated");
  };

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <h1>Users & roles</h1>
          <p className="page-sub">
            Admin-only directory. View every teammate, change roles, and invite
            new users into the demo.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setOpen(true)}
        >
          Invite user
        </button>
      </div>

      <div className="role-guide">
        <strong>You are Admin</strong>
        <p>
          Manage who can access CoreCRM. Sales Managers qualify leads; Sales owns
          intake; Viewers browse read-only.
        </p>
      </div>

      <div className="stats">
        <article className="stat">
          <div className="stat__label">Team size</div>
          <div className="stat__value">{team.length}</div>
        </article>
        <article className="stat stat--brand">
          <div className="stat__label">Sales reps</div>
          <div className="stat__value">
            {team.filter((u) => u.role === "sales").length}
          </div>
        </article>
        <article className="stat stat--ok">
          <div className="stat__label">Active</div>
          <div className="stat__value">
            {team.filter((u) => u.status === "Active").length}
          </div>
        </article>
      </div>

      <div className="simple-table-wrap">
        <table className="simple-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {team.map((u) => (
              <tr key={u.id}>
                <td>
                  <strong>{u.name}</strong>
                </td>
                <td>{u.email}</td>
                <td>
                  <select
                    className="select"
                    style={{ minWidth: 160 }}
                    value={u.role}
                    onChange={(e) => setRole(u.id, e.target.value)}
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {ROLE_LABEL[r] || r}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <span
                    className={`badge ${u.status === "Active" ? "badge--qualified" : "badge--lost"}`}
                  >
                    {u.status}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      setStatus(
                        u.id,
                        u.status === "Active" ? "Inactive" : "Active"
                      )
                    }
                  >
                    {u.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open ? (
        <Modal title="Invite user" onClose={() => setOpen(false)}>
          <form onSubmit={submit}>
            <div className="field">
              <label>Name</label>
              <input
                className="input"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                className="input"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Role</label>
              <select
                className="select"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABEL[r] || r}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal__actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Send invite
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </section>
  );
}
