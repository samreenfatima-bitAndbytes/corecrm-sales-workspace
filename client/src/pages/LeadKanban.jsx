import { useCallback, useMemo } from "react";
import { LEAD_STATUSES, leadsVisibleTo } from "../data/demo";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";
import { useKanbanDnd } from "../hooks/useKanbanDnd";

export default function LeadKanban() {
  const { user } = useAuth();
  const { leads, updateLead } = useData();
  const canMove = user?.role !== "viewer";
  const scoped = useMemo(() => leadsVisibleTo(user, leads), [user, leads]);

  const onDropItem = useCallback(
    (id, status) => {
      const lead = scoped.find((l) => l.id === id);
      if (!lead || lead.status === status) return;
      // Sales cannot set Qualified — managers/admins only
      if (
        status === "Qualified" &&
        user?.role !== "salesmanager" &&
        user?.role !== "admin"
      ) {
        return;
      }
      updateLead(id, { status });
    },
    [scoped, updateLead, user?.role]
  );

  const { overKey, cardProps, columnProps } = useKanbanDnd({
    enabled: canMove,
    onDropItem,
  });

  const moveTargets = (status) => {
    let targets = LEAD_STATUSES.filter((s) => s !== status);
    if (user?.role === "sales") {
      targets = targets.filter((s) => s !== "Qualified");
    }
    return targets;
  };

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <h1>
            {user?.role === "sales" ? "My lead board" : "Lead kanban"}
          </h1>
          <p className="page-sub">
            {canMove
              ? "Drag cards between columns, or use the stage buttons on each card."
              : "Read-only board — drag and stage changes are disabled for Viewer."}
          </p>
        </div>
      </div>

      <div className="kanban">
        {LEAD_STATUSES.map((status) => (
          <div
            key={status}
            className={`kanban-col${overKey === status ? " is-drop-target" : ""}`}
            {...columnProps(status)}
          >
            <div className="kanban-col__title">
              {status} · {scoped.filter((l) => l.status === status).length}
            </div>
            {scoped
              .filter((l) => l.status === status)
              .map((lead) => (
                <article
                  key={lead.id}
                  className="kanban-card"
                  {...cardProps(lead.id)}
                >
                  <strong>{lead.name}</strong>
                  <span>{lead.company || "—"}</span>
                  <span>
                    {lead.source}
                    {user?.role !== "sales" ? ` · ${lead.assignedTo}` : ""}
                  </span>
                  {canMove ? (
                    <div className="actions">
                      {moveTargets(status).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => updateLead(lead.id, { status: s })}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          → {s}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
          </div>
        ))}
      </div>
    </section>
  );
}
