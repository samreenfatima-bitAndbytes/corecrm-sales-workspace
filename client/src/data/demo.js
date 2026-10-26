export const DEMO_USERS = [
  {
    email: "admin@corecrm.local",
    password: "Admin@123",
    role: "admin",
    name: "Alex Admin",
  },
  {
    email: "manager@corecrm.local",
    password: "Manager@123",
    role: "salesmanager",
    name: "Morgan Manager",
  },
  {
    email: "sales@corecrm.local",
    password: "Sales@123",
    role: "sales",
    name: "Sam Sales",
  },
  {
    email: "viewer@corecrm.local",
    password: "Viewer@123",
    role: "viewer",
    name: "Vera Viewer",
  },
];

export const ROLE_LABEL = {
  admin: "ADMIN",
  salesmanager: "SALES MANAGER",
  sales: "SALES",
  viewer: "VIEWER",
};

export const ROLE_HOME = {
  admin: "/app/dashboard",
  salesmanager: "/app/salesmanager",
  sales: "/app/leads",
  viewer: "/app/home",
};

export const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Converted", "Lost"];

export const DEAL_STAGES = [
  { id: "s1", name: "Prospecting", position: 1 },
  { id: "s2", name: "Negotiation", position: 2 },
  { id: "s3", name: "Won", position: 3 },
  { id: "s4", name: "Lost", position: 4 },
];

/**
 * Role menus mirror Rails policies:
 * - Admin: full ops + team users
 * - Sales Manager: all leads, companies, deals, qualify, analytics
 * - Sales: own leads + tasks only (no companies/deals)
 * - Viewer: read-only overview / leads / analytics
 */
export function navForRole(role) {
  if (role === "viewer") {
    return [
      { to: "/app/home", end: true, label: "Overview", id: "home" },
      { to: "/app/leads", end: true, label: "Browse leads", id: "leads" },
      { to: "/app/leads/kanban", label: "Lead board", id: "lead-kanban" },
      { to: "/app/analytics", label: "Analytics", id: "analytics" },
    ];
  }
  if (role === "salesmanager") {
    return [
      { to: "/app/salesmanager", end: true, label: "Manager queue", id: "sm" },
      { to: "/app/leads", end: true, label: "All leads", id: "leads" },
      { to: "/app/leads/kanban", label: "Lead kanban", id: "lead-kanban" },
      { to: "/app/companies", label: "Companies", id: "companies" },
      { to: "/app/deals", label: "Deals", id: "deals" },
      { to: "/app/analytics", label: "Analytics", id: "analytics" },
    ];
  }
  if (role === "admin") {
    return [
      { to: "/app/dashboard", end: true, label: "Dashboard", id: "dash" },
      { to: "/app/users", label: "Users & roles", id: "users" },
      { to: "/app/leads", end: true, label: "All leads", id: "leads" },
      { to: "/app/leads/kanban", label: "Lead kanban", id: "lead-kanban" },
      { to: "/app/companies", label: "Companies", id: "companies" },
      { to: "/app/deals", label: "Deals", id: "deals" },
      { to: "/app/tasks", label: "Tasks", id: "tasks" },
      { to: "/app/salesmanager", label: "Manager queue", id: "sm" },
      { to: "/app/analytics", label: "Analytics", id: "analytics" },
    ];
  }
  // sales — own pipeline only
  return [
    { to: "/app/leads", end: true, label: "My leads", id: "leads" },
    { to: "/app/leads/kanban", label: "My lead board", id: "lead-kanban" },
    { to: "/app/tasks", label: "My tasks", id: "tasks" },
  ];
}

export function leadsVisibleTo(user, leads) {
  if (!user) return [];
  if (user.role === "sales") {
    return leads.filter((l) => l.owner === user.email);
  }
  return leads;
}

export function tasksVisibleTo(user, tasks) {
  if (!user) return [];
  if (user.role === "sales") {
    return tasks.filter((t) => t.owner === user.email);
  }
  return tasks;
}

export const SEED_TEAM = [
  {
    id: "u1",
    name: "Alex Admin",
    email: "admin@corecrm.local",
    role: "admin",
    status: "Active",
  },
  {
    id: "u2",
    name: "Morgan Manager",
    email: "manager@corecrm.local",
    role: "salesmanager",
    status: "Active",
  },
  {
    id: "u3",
    name: "Sam Sales",
    email: "sales@corecrm.local",
    role: "sales",
    status: "Active",
  },
  {
    id: "u4",
    name: "Riley Rep",
    email: "riley@corecrm.local",
    role: "sales",
    status: "Active",
  },
  {
    id: "u5",
    name: "Vera Viewer",
    email: "viewer@corecrm.local",
    role: "viewer",
    status: "Active",
  },
];

export const SEED_LEADS = [
  {
    id: "L-1001",
    name: "Helena Costa",
    email: "helena@nortech.pt",
    phone: "+351 910 111 001",
    company: "NorTech",
    source: "Website",
    status: "New",
    tags: "hot",
    notes: "Requested product demo.",
    assignedTo: "Sam Sales",
    owner: "sales@corecrm.local",
  },
  {
    id: "L-1002",
    name: "Ricardo Alves",
    email: "ricardo@atlantic.io",
    phone: "+351 910 111 002",
    company: "Atlantic IO",
    source: "Referral",
    status: "Contacted",
    tags: "follow-up",
    notes: "Call back Thursday.",
    assignedTo: "Sam Sales",
    owner: "sales@corecrm.local",
  },
  {
    id: "L-1003",
    name: "Inês Martins",
    email: "ines@lisboa.health",
    phone: "+351 910 111 003",
    company: "Lisboa Health",
    source: "Trade show",
    status: "Qualified",
    tags: "enterprise",
    notes: "Ready for company conversion.",
    assignedTo: "Morgan Manager",
    owner: "manager@corecrm.local",
  },
  {
    id: "L-1004",
    name: "Pedro Sousa",
    email: "pedro@vineyard.pt",
    phone: "+351 910 111 004",
    company: "Vineyard Co",
    source: "Cold email",
    status: "Converted",
    tags: "won-lead",
    notes: "Converted to company record.",
    assignedTo: "Sam Sales",
    owner: "sales@corecrm.local",
    convertedAt: "2026-10-12",
  },
  {
    id: "L-1005",
    name: "Ana Ribeiro",
    email: "ana@coastal.shop",
    phone: "+351 910 111 005",
    company: "Coastal Shop",
    source: "LinkedIn",
    status: "Lost",
    tags: "",
    notes: "Chose competitor.",
    assignedTo: "Sam Sales",
    owner: "sales@corecrm.local",
  },
  {
    id: "L-1006",
    name: "Tiago Ferreira",
    email: "tiago@buildright.pt",
    phone: "+351 910 111 006",
    company: "BuildRight",
    source: "Website",
    status: "New",
    tags: "smb",
    notes: "Interested in CRM rollout.",
    assignedTo: "Sam Sales",
    owner: "sales@corecrm.local",
  },
  {
    id: "L-1007",
    name: "Sofia Mendes",
    email: "sofia@orbit.pt",
    phone: "+351 910 111 008",
    company: "Orbit Labs",
    source: "Referral",
    status: "Contacted",
    tags: "smb",
    notes: "Owned by Riley — Sales users only see their own leads.",
    assignedTo: "Riley Rep",
    owner: "riley@corecrm.local",
  },
];

export const SEED_COMPANIES = [
  {
    id: "C-2001",
    name: "Vineyard Co",
    leadId: "L-1004",
    industry: "Agriculture",
    website: "https://vineyard.pt",
    address: "Douro, Portugal",
    phone: "+351 220 000 100",
    email: "hello@vineyard.pt",
  },
  {
    id: "C-2002",
    name: "Lisboa Health",
    leadId: "L-1003",
    industry: "Healthcare",
    website: "https://lisboa.health",
    address: "Lisbon, Portugal",
    phone: "+351 210 000 200",
    email: "ops@lisboa.health",
  },
];

export const SEED_CONTACTS = [
  {
    id: "CT-1",
    name: "Pedro Sousa",
    email: "pedro@vineyard.pt",
    phone: "+351 910 111 004",
    title: "CEO",
    companyId: "C-2001",
  },
  {
    id: "CT-2",
    name: "Inês Martins",
    email: "ines@lisboa.health",
    phone: "+351 910 111 003",
    title: "Procurement Lead",
    companyId: "C-2002",
  },
  {
    id: "CT-3",
    name: "Carla Dias",
    email: "carla@lisboa.health",
    phone: "+351 910 111 007",
    title: "IT Manager",
    companyId: "C-2002",
  },
];

export const SEED_DEALS = [
  {
    id: "D-3001",
    title: "Vineyard CRM rollout",
    value: 18000,
    probability: 80,
    closeDate: "2026-11-15",
    stageId: "s2",
    companyId: "C-2001",
    contactId: "CT-1",
    owner: "sales@corecrm.local",
  },
  {
    id: "D-3002",
    title: "Lisboa Health seats",
    value: 42000,
    probability: 55,
    closeDate: "2026-12-01",
    stageId: "s1",
    companyId: "C-2002",
    contactId: "CT-2",
    owner: "sales@corecrm.local",
  },
  {
    id: "D-3003",
    title: "Vineyard add-ons",
    value: 4500,
    probability: 95,
    closeDate: "2026-10-20",
    stageId: "s3",
    companyId: "C-2001",
    contactId: "CT-1",
    owner: "manager@corecrm.local",
    wonAt: "2026-10-18",
  },
];

export const SEED_TASKS = [
  {
    id: "T-1",
    title: "Send pricing PDF",
    dueDate: "2026-10-28",
    status: 0,
    taskableType: "Lead",
    taskableId: "L-1001",
    owner: "sales@corecrm.local",
  },
  {
    id: "T-2",
    title: "Schedule discovery call",
    dueDate: "2026-10-27",
    status: 0,
    taskableType: "Deal",
    taskableId: "D-3002",
    owner: "sales@corecrm.local",
  },
  {
    id: "T-3",
    title: "Qualify BuildRight lead",
    dueDate: "2026-10-30",
    status: 1,
    taskableType: "Lead",
    taskableId: "L-1006",
    owner: "manager@corecrm.local",
  },
];

export const SEED_ACTIVITY = [
  { id: "a1", text: "Helena Costa lead created from Website", at: "2026-10-20" },
  { id: "a2", text: "Inês Martins marked Qualified", at: "2026-10-19" },
  { id: "a3", text: "Deal Vineyard add-ons won (€4,500)", at: "2026-10-18" },
  { id: "a4", text: "Pedro Sousa converted to company", at: "2026-10-12" },
];
