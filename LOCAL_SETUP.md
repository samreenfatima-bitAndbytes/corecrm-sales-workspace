# CoreCRM — static demo setup

No Ruby, PostgreSQL, or Redis required. The Vite client ships with seeded CRM data in `localStorage`.

```bash
cd client
npm install
npm run dev    # http://localhost:2080
```

## Demo accounts

| Role          | Email                   | Password      | What you get |
|---------------|-------------------------|---------------|--------------|
| Admin         | `admin@corecrm.local`   | `Admin@123`   | Dashboard, **Users & roles**, all leads, companies, deals, tasks, manager queue, analytics |
| Sales Manager | `manager@corecrm.local` | `Manager@123` | Manager queue, all leads, companies, deals, qualify, analytics |
| Sales         | `sales@corecrm.local`   | `Sales@123`   | **Own leads only** + tasks (no companies/deals) |
| Viewer        | `viewer@corecrm.local`  | `Viewer@123`  | Read-only overview, browse leads, analytics |

## Role matrix (aligned with Rails policies)

| Area            | Admin | Sales Manager | Sales     | Viewer    |
|-----------------|-------|---------------|-----------|-----------|
| Users & roles   | ✓     | —             | —         | —         |
| All leads       | ✓     | ✓             | own only  | read-only |
| Qualify leads   | ✓     | ✓             | —         | —         |
| Companies       | ✓     | ✓             | —         | —         |
| Deals kanban    | ✓     | ✓             | —         | —         |
| Tasks           | ✓     | —             | own       | —         |
| Analytics       | ✓     | ✓             | —         | read-only |

Sales can create leads and mark Contacted/Lost; only Admin / Sales Manager can set **Qualified**.

## Reset data

Use **Reset demo data** in the sidebar, or:

```js
localStorage.removeItem("corecrm_data_v2");
localStorage.removeItem("corecrm_auth_v1");
location.reload();
```

## Vercel

Deploy the **static client only** (do not let Vercel build Rails/Docker).

**Option A — root directory `client` (simplest in Vercel UI)**  
- Root Directory: `client`  
- Framework: Vite  
- Build: `npm run build`  
- Output: `dist`

**Option B — repo root**  
Root `vercel.json` already runs `cd client && npm ci && npm run build` and outputs `client/dist`.  
Rails Docker file is named `Dockerfile.rails` so Vercel does not pick it up.

## Rails app (optional)

The original Rails 8 API/UI remains in this repo (`app/`, `Gemfile`). It needs Ruby 3.2.3, PostgreSQL, and Redis — not required for the static demo.
