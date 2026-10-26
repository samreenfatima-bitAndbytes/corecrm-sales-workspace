import { Link } from "react-router-dom";
import { LEAD_STATUSES } from "../data/demo";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";

/** Viewer-only read overview */
export default function Home() {
  const { user } = useAuth();
  const { leads, deals, activity, stages } = useData();

  const pipeline = deals
    .filter((d) => d.stageId !== "s4")
    .reduce((sum, d) => sum + Number(d.value || 0), 0);
  const won = deals
    .filter((d) => d.stageId === "s3")
    .reduce((sum, d) => sum + Number(d.value || 0), 0);

  const leadBars = LEAD_STATUSES.map((status) => {
    const count = leads.filter((l) => l.status === status).length;
    const pct = leads.length ? Math.round((count / leads.length) * 100) : 0;
    return { status, count, pct };
  });

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <h1>Pipeline overview</h1>
          <p className="page-sub">
            Read-only workspace for Viewer — browse leads and analytics. You
            cannot create or edit records.
          </p>
        </div>
        <div className="toolbar">
          <Link className="btn btn-primary" to="/app/leads">
            Browse leads
          </Link>
          <Link className="btn btn-secondary" to="/app/analytics">
            Analytics
          </Link>
        </div>
      </div>

      <div className="role-guide">
        <strong>You are {user?.name}</strong>
        <p>
          Role: <b>viewer</b>. Sales creates leads → Sales Manager qualifies →
          convert to company → deals &amp; tasks. Your access is view-only.
        </p>
      </div>

      <div className="stats">
        <article className="stat stat--brand">
          <div className="stat__label">Leads</div>
          <div className="stat__value">{leads.length}</div>
        </article>
        <article className="stat">
          <div className="stat__label">Open deals</div>
          <div className="stat__value">
            {deals.filter((d) => !["s3", "s4"].includes(d.stageId)).length}
          </div>
        </article>
        <article className="stat stat--ok">
          <div className="stat__label">Pipeline €</div>
          <div className="stat__value">{pipeline.toLocaleString()}</div>
        </article>
        <article className="stat stat--warn">
          <div className="stat__label">Won €</div>
          <div className="stat__value">{won.toLocaleString()}</div>
        </article>
      </div>

      <div className="grid-2">
        <div className="setup-card">
          <div className="panel-title">Leads by status</div>
          <div className="bar-list">
            {leadBars.map((b) => (
              <div key={b.status} className="bar-row">
                <div className="bar-row__top">
                  <span>{b.status}</span>
                  <span>
                    {b.count} · {b.pct}%
                  </span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${b.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="setup-card">
          <div className="panel-title">Deal stages</div>
          <ul className="attention-list">
            {stages.map((stage) => {
              const count = deals.filter((d) => d.stageId === stage.id).length;
              const value = deals
                .filter((d) => d.stageId === stage.id)
                .reduce((s, d) => s + Number(d.value), 0);
              return (
                <li key={stage.id}>
                  <span>
                    {stage.name} · {count} deals
                  </span>
                  <span>€{value.toLocaleString()}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="grid-2">
        <div className="setup-card">
          <div className="panel-title">Recent leads</div>
          <div
            className="simple-table-wrap"
            style={{ border: "none", boxShadow: "none" }}
          >
            <table className="simple-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 5).map((l) => (
                  <tr key={l.id}>
                    <td>
                      <strong>{l.name}</strong>
                      <div className="page-sub">{l.company}</div>
                    </td>
                    <td>
                      <span className={`badge badge--${l.status.toLowerCase()}`}>
                        {l.status}
                      </span>
                    </td>
                    <td>{l.assignedTo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="setup-card">
          <div className="panel-title">Recent activity</div>
          <ul className="attention-list">
            {activity.slice(0, 6).map((a) => (
              <li key={a.id}>
                <span>{a.text}</span>
                <span>{a.at}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
