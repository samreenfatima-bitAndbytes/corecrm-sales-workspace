import { useMemo, useState } from "react";
import { LEAD_STATUSES, leadsVisibleTo } from "../data/demo";
import Modal from "../components/Modal";
import { IconSearch } from "../components/Icons";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";

function statusClass(status) {
  return `badge badge--${String(status || "new").toLowerCase()}`;
}

export default function Leads() {
  const { user } = useAuth();
  const { leads, addLead, updateLead, convertLead } = useData();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "Website",
  });

  const isViewer = user?.role === "viewer";
  const isSales = user?.role === "sales";
  const canQualify = user?.role === "salesmanager" || user?.role === "admin";
  const canCreate =
    user?.role === "sales" ||
    user?.role === "admin" ||
    user?.role === "salesmanager";
  const canConvert = canCreate || canQualify;

  const scoped = useMemo(
    () => leadsVisibleTo(user, leads),
    [user, leads]
  );

  const rows = useMemo(() => {
    let list = scoped;
    if (filter !== "all") list = list.filter((l) => l.status === filter);
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter(
      (l) =>
        l.name.toLowerCase().includes(s) ||
        l.company.toLowerCase().includes(s) ||
        l.status.toLowerCase().includes(s) ||
        l.source.toLowerCase().includes(s) ||
        (l.assignedTo || "").toLowerCase().includes(s)
    );
  }, [scoped, filter, q]);

  const submit = (e) => {
    e.preventDefault();
    addLead(form, user);
    setOpen(false);
    setForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      source: "Website",
    });
  };

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <h1>{isSales ? "My leads" : isViewer ? "Browse leads" : "All leads"}</h1>
          <p className="page-sub">
            {isViewer
              ? "Read-only lead list across the team — no create or status changes."
              : isSales
                ? "Only leads assigned to you. Create intake; Managers qualify to Qualified."
                : "Full team lead list. Qualify, convert, and oversee the pipeline."}
          </p>
        </div>
        <div className="toolbar">
          <div className="search-field">
            <IconSearch />
            <input
              placeholder="Search leads…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          {canCreate ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setOpen(true)}
            >
              Create lead
            </button>
          ) : null}
        </div>
      </div>

      {isSales ? (
        <div className="role-guide">
          <strong>You are Sales</strong>
          <p>
            You only see your own leads (Riley’s Orbit Labs lead is hidden). Create
            leads, mark Contacted / Lost, convert after a Manager qualifies.
          </p>
        </div>
      ) : null}
      {isViewer ? (
        <div className="role-guide">
          <strong>You are Viewer</strong>
          <p>
            Browse only — create, qualify, convert, and status changes are disabled.
          </p>
        </div>
      ) : null}

      <div className="filter-tabs">
        <button
          type="button"
          className={filter === "all" ? "is-active" : undefined}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        {LEAD_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            className={filter === s ? "is-active" : undefined}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="simple-table-wrap">
        <table className="simple-table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Company</th>
              <th>Source</th>
              <th>Status</th>
              <th>Owner</th>
              {!isViewer ? <th>Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <strong>{row.name}</strong>
                  <div className="page-sub">{row.email}</div>
                </td>
                <td>{row.company}</td>
                <td>{row.source}</td>
                <td>
                  <span className={statusClass(row.status)}>{row.status}</span>
                </td>
                <td>{row.assignedTo}</td>
                {!isViewer ? (
                  <td>
                    <div className="toolbar">
                      {canCreate && row.status === "New" ? (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() =>
                            updateLead(row.id, { status: "Contacted" })
                          }
                        >
                          Mark contacted
                        </button>
                      ) : null}
                      {canQualify &&
                      (row.status === "New" || row.status === "Contacted") ? (
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() =>
                            updateLead(row.id, { status: "Qualified" })
                          }
                        >
                          Qualify
                        </button>
                      ) : null}
                    {canConvert && row.status === "Qualified" ? (
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => convertLead(row.id)}
                        >
                          Convert
                        </button>
                      ) : null}
                      {canCreate &&
                      !["Converted", "Lost"].includes(row.status) ? (
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() =>
                            updateLead(row.id, { status: "Lost" })
                          }
                        >
                          Lost
                        </button>
                      ) : null}
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open ? (
        <Modal title="Create lead" onClose={() => setOpen(false)}>
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
              <label>Phone</label>
              <input
                className="input"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Company</label>
              <input
                className="input"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Source</label>
              <select
                className="select"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
              >
                <option>Website</option>
                <option>Referral</option>
                <option>LinkedIn</option>
                <option>Trade show</option>
                <option>Cold email</option>
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
                Save lead
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </section>
  );
}
