import { useMemo } from "react";
import { LEAD_STATUSES } from "../data/demo";
import { useData } from "../hooks/useData";

export default function Analytics() {
  const { leads, deals, stages } = useData();

  const leadBars = useMemo(() => {
    const total = Math.max(leads.length, 1);
    return LEAD_STATUSES.map((status) => {
      const count = leads.filter((l) => l.status === status).length;
      return { status, count, pct: Math.round((count / total) * 100) };
    });
  }, [leads]);

  const dealBars = useMemo(() => {
    const total = Math.max(deals.length, 1);
    return stages.map((stage) => {
      const count = deals.filter((d) => d.stageId === stage.id).length;
      const value = deals
        .filter((d) => d.stageId === stage.id)
        .reduce((s, d) => s + Number(d.value), 0);
      return {
        name: stage.name,
        count,
        value,
        pct: Math.round((count / total) * 100),
      };
    });
  }, [deals, stages]);

  const converted = leads.filter((l) => l.status === "Converted").length;
  const conversionRate = leads.length
    ? Math.round((converted / leads.length) * 100)
    : 0;

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <h1>Analytics</h1>
          <p className="page-sub">Lead conversion and deal stage distribution.</p>
        </div>
      </div>

      <div className="stats">
        <article className="stat stat--brand">
          <div className="stat__label">Lead conversion</div>
          <div className="stat__value">{conversionRate}%</div>
        </article>
        <article className="stat stat--ok">
          <div className="stat__label">Won deals</div>
          <div className="stat__value">
            {deals.filter((d) => d.stageId === "s3").length}
          </div>
        </article>
        <article className="stat">
          <div className="stat__label">Won value €</div>
          <div className="stat__value">
            {deals
              .filter((d) => d.stageId === "s3")
              .reduce((s, d) => s + Number(d.value), 0)
              .toLocaleString()}
          </div>
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
          <div className="panel-title">Deals by stage</div>
          <div className="bar-list">
            {dealBars.map((b) => (
              <div key={b.name} className="bar-row">
                <div className="bar-row__top">
                  <span>{b.name}</span>
                  <span>
                    {b.count} · €{b.value.toLocaleString()}
                  </span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${b.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
