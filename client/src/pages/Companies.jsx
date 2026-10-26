import { useMemo, useState } from "react";
import { useData } from "../hooks/useData";

export default function Companies() {
  const { companies, contacts, deals } = useData();
  const [active, setActive] = useState(companies[0]?.id || null);

  const selected = useMemo(
    () => companies.find((c) => c.id === active) || companies[0],
    [companies, active]
  );

  const companyContacts = contacts.filter((c) => c.companyId === selected?.id);
  const companyDeals = deals.filter((d) => d.companyId === selected?.id);

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <h1>Companies</h1>
          <p className="page-sub">
            Accounts created from converted leads, with contacts and deals.
          </p>
        </div>
      </div>

      <div className="grid-2">
        <div className="simple-table-wrap">
          <table className="simple-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Industry</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr
                  key={c.id}
                  style={{
                    cursor: "pointer",
                    background: selected?.id === c.id ? "#eefbf7" : undefined,
                  }}
                  onClick={() => setActive(c.id)}
                >
                  <td>
                    <strong>{c.name}</strong>
                  </td>
                  <td>{c.industry}</td>
                  <td>{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="setup-card">
          {selected ? (
            <>
              <div className="panel-title">{selected.name}</div>
              <p className="page-sub">
                {selected.address || "No address"} · {selected.phone}
              </p>
              <p className="page-sub" style={{ marginTop: "0.75rem" }}>
                <strong>Contacts</strong>
              </p>
              <ul className="attention-list">
                {companyContacts.map((c) => (
                  <li key={c.id}>
                    <span>
                      {c.name} · {c.title}
                    </span>
                    <span>{c.email}</span>
                  </li>
                ))}
              </ul>
              <p className="page-sub" style={{ marginTop: "0.75rem" }}>
                <strong>Deals</strong>
              </p>
              <ul className="attention-list">
                {companyDeals.map((d) => (
                  <li key={d.id}>
                    <span>{d.title}</span>
                    <span>€{Number(d.value).toLocaleString()}</span>
                  </li>
                ))}
                {!companyDeals.length ? <li>No deals yet</li> : null}
              </ul>
            </>
          ) : (
            <p className="page-sub">No companies yet — convert a qualified lead.</p>
          )}
        </div>
      </div>
    </section>
  );
}
