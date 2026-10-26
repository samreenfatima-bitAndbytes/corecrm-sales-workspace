import { Link } from "react-router-dom";
import { useData } from "../hooks/useData";

export default function SalesManager() {
  const { leads, updateLead, convertLead } = useData();
  const queue = leads.filter((l) =>
    ["New", "Contacted", "Qualified"].includes(l.status)
  );

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <h1>Sales Manager queue</h1>
          <p className="page-sub">
            Review inbound leads, qualify promising ones, and push conversions.
          </p>
        </div>
        <Link to="/app/analytics" className="btn btn-secondary">
          Analytics
        </Link>
      </div>

      <div className="role-guide">
        <strong>Manager focus</strong>
        <p>
          Qualify New/Contacted leads. Qualified leads can convert into companies
          for the sales pipeline.
        </p>
      </div>

      <div className="stats">
        <article className="stat">
          <div className="stat__label">In queue</div>
          <div className="stat__value">{queue.length}</div>
        </article>
        <article className="stat stat--brand">
          <div className="stat__label">Qualified</div>
          <div className="stat__value">
            {leads.filter((l) => l.status === "Qualified").length}
          </div>
        </article>
      </div>

      <div className="simple-table-wrap">
        <table className="simple-table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Status</th>
              <th>Source</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((row) => (
              <tr key={row.id}>
                <td>
                  <strong>{row.name}</strong>
                  <div className="page-sub">{row.company}</div>
                </td>
                <td>
                  <span className={`badge badge--${row.status.toLowerCase()}`}>
                    {row.status}
                  </span>
                </td>
                <td>{row.source}</td>
                <td>{row.notes || "—"}</td>
                <td>
                  <div className="toolbar">
                    {row.status !== "Qualified" ? (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                          updateLead(row.id, { status: "Qualified" })
                        }
                      >
                        Qualify
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => convertLead(row.id)}
                      >
                        Convert
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!queue.length ? (
              <tr>
                <td colSpan={5}>Queue clear — great work.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
