import { Link } from "react-router-dom";
import { useData } from "../hooks/useData";

export default function Dashboard() {
  const { leads, companies, deals, tasks, activity, team } = useData();
  const openTasks = tasks.filter((t) => t.status === 0).length;
  const pipeline = deals
    .filter((d) => d.stageId !== "s4")
    .reduce((sum, d) => sum + Number(d.value || 0), 0);

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <h1>Admin dashboard</h1>
          <p className="page-sub">
            System overview across users, leads, companies, and deal pipeline.
          </p>
        </div>
        <div className="toolbar">
          <Link to="/app/users" className="btn btn-secondary">
            Users ({team?.length || 0})
          </Link>
          <Link to="/app/analytics" className="btn btn-primary">
            Analytics
          </Link>
        </div>
      </div>

      <div className="role-guide">
        <strong>You are Admin</strong>
        <p>
          Full access including <b>Users &amp; roles</b>, all leads, companies,
          deals, tasks, manager queue, and analytics. Sales owns intake; managers
          qualify.
        </p>
      </div>

      <div className="stats">
        <article className="stat">
          <div className="stat__label">Team users</div>
          <div className="stat__value">{team?.length || 0}</div>
        </article>
        <article className="stat stat--brand">
          <div className="stat__label">Leads</div>
          <div className="stat__value">{leads.length}</div>
        </article>
        <article className="stat">
          <div className="stat__label">Companies</div>
          <div className="stat__value">{companies.length}</div>
        </article>
        <article className="stat stat--ok">
          <div className="stat__label">Pipeline €</div>
          <div className="stat__value">{pipeline.toLocaleString()}</div>
        </article>
      </div>

      <div className="grid-2">
        <div className="setup-card">
          <div className="panel-title">Needs attention</div>
          <ul className="attention-list">
            <li>
              <span>
                {leads.filter((l) => l.status === "Qualified").length} qualified
                waiting conversion
              </span>
              <Link to="/app/salesmanager">Manager queue</Link>
            </li>
            <li>
              <span>{openTasks} open tasks</span>
              <Link to="/app/tasks">Tasks</Link>
            </li>
            <li>
              <span>
                {deals.filter((d) => d.stageId === "s2").length} deals in
                negotiation
              </span>
              <Link to="/app/deals">Deals</Link>
            </li>
          </ul>
        </div>
        <div className="setup-card">
          <div className="panel-title">Recent activity</div>
          <ul className="attention-list">
            {activity.slice(0, 5).map((a) => (
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
