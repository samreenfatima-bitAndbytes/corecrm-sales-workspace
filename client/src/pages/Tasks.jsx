import { useMemo, useState } from "react";
import Modal from "../components/Modal";
import { leadsVisibleTo, tasksVisibleTo } from "../data/demo";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";

export default function Tasks() {
  const { user } = useAuth();
  const { tasks, leads, deals, addTask, toggleTask } = useData();
  const isSales = user?.role === "sales";
  const scopedLeads = useMemo(
    () => leadsVisibleTo(user, leads),
    [user, leads]
  );
  const scopedTasks = useMemo(
    () => tasksVisibleTo(user, tasks),
    [user, tasks]
  );
  const relatedDeals = isSales ? [] : deals;

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    dueDate: "",
    taskableType: "Lead",
    taskableId: scopedLeads[0]?.id || "",
  });

  const labelFor = (t) => {
    if (t.taskableType === "Lead") {
      return scopedLeads.find((l) => l.id === t.taskableId)?.name ||
        leads.find((l) => l.id === t.taskableId)?.name ||
        t.taskableId;
    }
    return deals.find((d) => d.id === t.taskableId)?.title || t.taskableId;
  };

  const submit = (e) => {
    e.preventDefault();
    addTask(form, user);
    setOpen(false);
    setForm({
      title: "",
      dueDate: "",
      taskableType: "Lead",
      taskableId: scopedLeads[0]?.id || "",
    });
  };

  return (
    <section className="setup-page">
      <div className="setup-page__head">
        <div>
          <h1>{isSales ? "My tasks" : "Tasks"}</h1>
          <p className="page-sub">
            {isSales
              ? "Follow-ups on your leads only."
              : "Follow-ups linked to leads or deals across the team."}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setOpen(true)}
        >
          Add task
        </button>
      </div>

      <div className="simple-table-wrap">
        <table className="simple-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Related</th>
              <th>Due</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {scopedTasks.map((t) => (
              <tr key={t.id}>
                <td>
                  <strong>{t.title}</strong>
                </td>
                <td>
                  {t.taskableType}: {labelFor(t)}
                </td>
                <td>{t.dueDate}</td>
                <td>
                  <span
                    className={`badge ${t.status === 0 ? "badge--open" : "badge--done"}`}
                  >
                    {t.status === 0 ? "Open" : "Done"}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => toggleTask(t.id)}
                  >
                    {t.status === 0 ? "Complete" : "Reopen"}
                  </button>
                </td>
              </tr>
            ))}
            {!scopedTasks.length ? (
              <tr>
                <td colSpan={5}>No tasks yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {open ? (
        <Modal title="Add task" onClose={() => setOpen(false)}>
          <form onSubmit={submit}>
            <div className="field">
              <label>Title</label>
              <input
                className="input"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Due date</label>
              <input
                className="input"
                type="date"
                required
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
            {!isSales ? (
              <div className="field">
                <label>Related to</label>
                <select
                  className="select"
                  value={form.taskableType}
                  onChange={(e) => {
                    const taskableType = e.target.value;
                    setForm({
                      ...form,
                      taskableType,
                      taskableId:
                        taskableType === "Lead"
                          ? scopedLeads[0]?.id || ""
                          : relatedDeals[0]?.id || "",
                    });
                  }}
                >
                  <option>Lead</option>
                  <option>Deal</option>
                </select>
              </div>
            ) : null}
            <div className="field">
              <label>Record</label>
              <select
                className="select"
                value={form.taskableId}
                onChange={(e) =>
                  setForm({ ...form, taskableId: e.target.value })
                }
                required
              >
                {(form.taskableType === "Lead" ? scopedLeads : relatedDeals).map(
                  (r) => (
                    <option key={r.id} value={r.id}>
                      {r.name || r.title}
                    </option>
                  )
                )}
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
                Save
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </section>
  );
}
