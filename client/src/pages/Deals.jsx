import { useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";
import { useKanbanDnd } from "../hooks/useKanbanDnd";

export default function Deals() {
  const { user } = useAuth();
  const { deals, stages, companies, moveDeal } = useData();
  const canMove = user?.role !== "viewer";

  const companyName = (id) =>
    companies.find((c) => c.id === id)?.name || "Company";

  const onDropItem = useCallback(
    (id, stageId) => {
      const deal = deals.find((d) => d.id === id);
      if (!deal || deal.stageId === stageId) return;
      moveDeal(id, stageId);
    },
    [deals, moveDeal]
  );

  const { overKey, cardProps, columnProps } = useKanbanDnd({
    enabled: canMove,
    onDropItem,
  });

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <h1>Deals kanban</h1>
          <p className="page-sub">
            {canMove
              ? "Drag deals across Prospecting → Negotiation → Won / Lost, or use the stage buttons."
              : "Read-only deal board — drag and stage changes are disabled for Viewer."}
          </p>
        </div>
      </div>

      <div className="stats">
        <article className="stat stat--brand">
          <div className="stat__label">Open deals</div>
          <div className="stat__value">
            {deals.filter((d) => d.stageId !== "s3" && d.stageId !== "s4").length}
          </div>
        </article>
        <article className="stat stat--ok">
          <div className="stat__label">Won €</div>
          <div className="stat__value">
            {deals
              .filter((d) => d.stageId === "s3")
              .reduce((s, d) => s + Number(d.value), 0)
              .toLocaleString()}
          </div>
        </article>
      </div>

      <div className="kanban">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={`kanban-col${overKey === stage.id ? " is-drop-target" : ""}`}
            {...columnProps(stage.id)}
          >
            <div className="kanban-col__title">
              {stage.name} ·{" "}
              {deals.filter((d) => d.stageId === stage.id).length}
            </div>
            {deals
              .filter((d) => d.stageId === stage.id)
              .map((deal) => (
                <article
                  key={deal.id}
                  className="kanban-card"
                  {...cardProps(deal.id)}
                >
                  <strong>{deal.title}</strong>
                  <span>{companyName(deal.companyId)}</span>
                  <span>
                    €{Number(deal.value).toLocaleString()} · {deal.probability}%
                  </span>
                  {canMove ? (
                    <div className="actions">
                      {stages
                        .filter((s) => s.id !== stage.id)
                        .map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => moveDeal(deal.id, s.id)}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            → {s.name}
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
