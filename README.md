# CoreCRM

Sales CRM with role-based access (Admin, Sales Manager, Sales, Viewer).

This repo includes:

1. **Static demo (recommended for demos / Vercel)** — Vite + React client under `client/`
2. **Original Rails 8 app** — full stack with PostgreSQL, Devise, Sidekiq (optional)

## Static demo (no Ruby / DB)

```bash
cd client
npm install
npm run dev
```

Open http://localhost:2080/login

| Role          | Email                   | Password      | Tabs |
|---------------|-------------------------|---------------|------|
| Admin         | admin@corecrm.local     | Admin@123     | Dashboard, **Users**, all CRM |
| Sales Manager | manager@corecrm.local   | Manager@123   | Queue, leads, companies, deals, analytics |
| Sales         | sales@corecrm.local     | Sales@123     | My leads + tasks only |
| Viewer        | viewer@corecrm.local    | Viewer@123    | Read-only overview / leads / analytics |

See [LOCAL_SETUP.md](./LOCAL_SETUP.md) for the full role matrix.

## Vercel

Deploy **`client/`** as Vite (Root Directory = `client`), or use repo-root `vercel.json` which builds `client/dist`. Do not use the Rails Dockerfile for Vercel.
