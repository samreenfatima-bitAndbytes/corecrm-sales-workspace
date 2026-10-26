import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEAL_STAGES,
  SEED_ACTIVITY,
  SEED_COMPANIES,
  SEED_CONTACTS,
  SEED_DEALS,
  SEED_LEADS,
  SEED_TASKS,
  SEED_TEAM,
} from "../data/demo";

const KEY = "corecrm_data_v2";
const DataContext = createContext(null);

function seed() {
  return {
    leads: SEED_LEADS.map((l) => ({ ...l })),
    companies: SEED_COMPANIES.map((c) => ({ ...c })),
    contacts: SEED_CONTACTS.map((c) => ({ ...c })),
    deals: SEED_DEALS.map((d) => ({ ...d })),
    tasks: SEED_TASKS.map((t) => ({ ...t })),
    stages: DEAL_STAGES.map((s) => ({ ...s })),
    activity: SEED_ACTIVITY.map((a) => ({ ...a })),
    team: SEED_TEAM.map((u) => ({ ...u })),
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    return { ...seed(), ...JSON.parse(raw) };
  } catch {
    return seed();
  }
}

export function DataProvider({ children }) {
  const [data, setData] = useState(() => load());
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [data]);

  const notify = useCallback((message) => {
    setToast(message);
    window.clearTimeout(notify._t);
    notify._t = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const patch = useCallback((key, updater) => {
    setData((prev) => {
      const current = prev[key];
      const next =
        typeof updater === "function" ? updater(current) : updater;
      return { ...prev, [key]: next };
    });
  }, []);

  const addLead = useCallback(
    (lead, actor) => {
      const id = `L-${1000 + data.leads.length + 1}`;
      const row = {
        id,
        status: "New",
        tags: "",
        notes: "",
        assignedTo: actor?.name || "Unassigned",
        owner: actor?.email || "",
        ...lead,
      };
      patch("leads", (list) => [row, ...list]);
      patch("activity", (list) => [
        {
          id: `a-${Date.now()}`,
          text: `${row.name} lead created`,
          at: new Date().toISOString().slice(0, 10),
        },
        ...list,
      ]);
      notify(`Lead ${row.name} created`);
      return row;
    },
    [data.leads.length, notify, patch]
  );

  const updateLead = useCallback(
    (id, changes) => {
      patch("leads", (list) =>
        list.map((l) => (l.id === id ? { ...l, ...changes } : l))
      );
      notify("Lead updated");
    },
    [notify, patch]
  );

  const convertLead = useCallback(
    (id) => {
      const lead = data.leads.find((l) => l.id === id);
      if (!lead) return;
      const companyId = `C-${2000 + data.companies.length + 1}`;
      const contactId = `CT-${data.contacts.length + 1}`;
      patch("companies", (list) => [
        {
          id: companyId,
          name: lead.company || lead.name,
          leadId: lead.id,
          industry: "General",
          website: "",
          address: "",
          phone: lead.phone,
          email: lead.email,
        },
        ...list,
      ]);
      patch("contacts", (list) => [
        {
          id: contactId,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          title: "Primary",
          companyId,
        },
        ...list,
      ]);
      updateLead(id, {
        status: "Converted",
        convertedAt: new Date().toISOString().slice(0, 10),
      });
      notify(`${lead.name} converted to company`);
    },
    [
      data.companies.length,
      data.contacts.length,
      data.leads,
      notify,
      patch,
      updateLead,
    ]
  );

  const moveDeal = useCallback(
    (id, stageId) => {
      patch("deals", (list) =>
        list.map((d) =>
          d.id === id
            ? {
                ...d,
                stageId,
                wonAt:
                  stageId === "s3"
                    ? new Date().toISOString().slice(0, 10)
                    : d.wonAt,
              }
            : d
        )
      );
      notify("Deal stage updated");
    },
    [notify, patch]
  );

  const addTask = useCallback(
    (task, actor) => {
      const row = {
        id: `T-${Date.now()}`,
        status: 0,
        owner: actor?.email || "",
        ...task,
      };
      patch("tasks", (list) => [row, ...list]);
      notify("Task added");
      return row;
    },
    [notify, patch]
  );

  const toggleTask = useCallback(
    (id) => {
      patch("tasks", (list) =>
        list.map((t) =>
          t.id === id ? { ...t, status: t.status === 0 ? 1 : 0 } : t
        )
      );
    },
    [patch]
  );

  const resetDemo = useCallback(() => {
    const fresh = seed();
    setData(fresh);
    localStorage.setItem(KEY, JSON.stringify(fresh));
    notify("Demo data reset");
  }, [notify]);

  const value = useMemo(
    () => ({
      ...data,
      toast,
      notify,
      patch,
      addLead,
      updateLead,
      convertLead,
      moveDeal,
      addTask,
      toggleTask,
      resetDemo,
    }),
    [
      data,
      toast,
      notify,
      patch,
      addLead,
      updateLead,
      convertLead,
      moveDeal,
      addTask,
      toggleTask,
      resetDemo,
    ]
  );

  return (
    <DataContext.Provider value={value}>{children}</DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
