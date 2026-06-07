# RyderOS Progress Tracker

## Current Layer

Layer 4 — Website Management (complete)

## Current Milestone

Layer 4 complete. Ready for Layer 5 — Tasks.

---

## Completed Layers

### Layer 1 — Foundation

* [x] Authentication (signup, email confirmation, login, logout)
* [x] Dashboard (shell with stat placeholder cards)
* [x] Navigation (sidebar with all current nav items)
* [ ] User Profile (name/email visible in sidebar but no dedicated profile page)
* [x] App Layout (dashboard layout with protected route wrapper)
* [x] Database Foundation (organizations, profiles, organization_members, RLS, triggers)

### Layer 2 — Core CRM

* [x] Contacts Table (id, organization_id, first/last name, email, phone, company, website_url, source, status, notes, archived_at, client_id)
* [x] Add Contact (form with all fields including website URL, server action)
* [x] Contact List (server-rendered, search + status filter, hides archived)
* [x] Contact Detail Page (two-column: edit form + activity log)
* [x] Edit Contact (edit form pre-populated, server action)
* [x] Status Labels (lead / prospect / client / inactive with colour-coded badges)
* [x] Search & Filters (URL-based search + status filter buttons)
* [x] Notes (dedicated contact_notes table, timestamped, author-tracked, deletable)
* [x] Website URL field on contact
* [x] Archive vs delete (soft delete with archived_at, restore supported)

### Layer 3 — Client Management

* [x] Clients Table (id, org_id, name, status, service_type, domain, website_url, gbp_status, payment_status, retainer_status, retainer_amount, notes)
* [x] Client Profiles (full detail page with 3-column layout)
* [x] Client Status (active / inactive / paused with colour badges)
* [x] Onboarding Checklist (10-item default checklist, interactive toggle with progress bar)
* [x] Retainer Tracking (retainer_status, retainer_amount fields)
* [x] Payment Tracking (payment_status with colour badges: current/overdue/paused/cancelled)
* [x] Link contacts to clients (client_id FK on contacts, linked contacts shown on client page)

### Layer 4 — Website Management

* [x] Websites Table (id, org_id, client_id, name, domain, hosting_provider, email_provider, status, launch_date, notes)
* [x] Website Checklist Items (category: launch / assets, completed, sort_order)
* [x] Website Revisions (description, status, priority, completed_at)
* [x] Website List Page `/websites` — table with status badges, domain links, client link
* [x] New Website Page `/websites/new` — form with auto-seeded checklists on creation
* [x] Website Detail Page `/websites/[id]` — 3-column: details form / checklists / revisions
* [x] Status Tracking (not_started → in_progress → review → live → maintenance)
* [x] Launch Checklist (14 default items: domain, hosting, SSL, DNS, email, GA, GSC, GBP, launch)
* [x] Asset Checklist (9 default items: logo, brand, content, photos, socials, access)
* [x] Revision Tracker (add revisions, set priority low/medium/high, update status, delete, collapse completed)
* [x] Websites added to sidebar navigation

### Layer 5 — Tasks

* [ ] Tasks Table
* [ ] Task Creation
* [ ] Due Dates
* [ ] Priorities
* [ ] Task Linking
* [ ] Dashboard Tasks

### Layer 6 — Lead Pipeline

* [ ] Leads Table
* [ ] Lead Detail Pages
* [ ] Lead Stages
* [ ] Kanban Board
* [ ] Won/Lost Tracking
* [ ] Lead Source Tracking

### Layer 7 — Enquiry Forms

* [ ] Form Submissions
* [ ] API Endpoints
* [ ] Website Integration
* [ ] Notifications
* [ ] Lead Creation

### Layer 8 — Dashboard Intelligence

* [ ] Dashboard Cards
* [ ] Recent Activity
* [ ] Revenue Summary
* [ ] Alerts

### Layer 9 — Retainers & Payments

* [ ] Packages
* [ ] Retainers
* [ ] Payment Tracking
* [ ] Revenue Dashboard

### Layer 10 — Client Portal

* [ ] Client Login
* [ ] Client Dashboard
* [ ] Support Requests
* [ ] Lead Visibility

### Layer 11 — Support System

* [ ] Support Tickets
* [ ] Ticket Statuses
* [ ] Comments
* [ ] File Uploads

### Layer 12 — Analytics

* [ ] Lead Analytics
* [ ] Form Analytics
* [ ] Website Analytics
* [ ] Reporting

### Layer 13 — AI Chat

* [ ] AI Chat Widget
* [ ] Lead Capture
* [ ] Conversation Storage

### Layer 14 — Automations

* [ ] Triggers
* [ ] Actions
* [ ] Lead Follow-up
* [ ] Email Automations

### Layer 15 — SaaS Infrastructure

* [ ] Organizations
* [ ] Permissions
* [ ] Multi-Tenancy
* [ ] Billing
* [ ] Subscriptions

---

## Database Structure

### `organizations`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | auto-generated |
| name | TEXT | business name |
| slug | TEXT UNIQUE | url-safe identifier |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | auto-updated by trigger |

### `profiles`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | FK → auth.users |
| full_name | TEXT | nullable |
| avatar_url | TEXT | nullable |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | auto-updated by trigger |

### `organization_members`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| organization_id | UUID FK | → organizations |
| user_id | UUID FK | → auth.users |
| role | ENUM | owner / admin / member |
| created_at | TIMESTAMPTZ | |

### `contacts`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| organization_id | UUID FK | → organizations (RLS key) |
| client_id | UUID FK | → clients (nullable) |
| first_name | TEXT | required |
| last_name | TEXT | nullable |
| email | TEXT | nullable |
| phone | TEXT | nullable |
| company_name | TEXT | nullable |
| website_url | TEXT | nullable |
| source | TEXT | nullable |
| status | TEXT | lead / prospect / client / inactive |
| notes | TEXT | nullable (quick note — full activity in contact_notes) |
| archived_at | TIMESTAMPTZ | nullable — soft delete |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | auto-updated |

### `contact_notes`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| organization_id | UUID FK | → organizations |
| contact_id | UUID FK | → contacts |
| author_id | UUID FK | → auth.users |
| content | TEXT | required |
| created_at | TIMESTAMPTZ | |

### `clients`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| organization_id | UUID FK | → organizations |
| name | TEXT | business/client name |
| status | TEXT | active / inactive / paused |
| service_type | TEXT | nullable |
| domain | TEXT | nullable |
| website_url | TEXT | nullable |
| google_business_profile_status | TEXT | not_started / claimed / optimized |
| payment_status | TEXT | current / overdue / paused / cancelled |
| retainer_status | TEXT | active / inactive / paused |
| retainer_amount | NUMERIC(10,2) | nullable |
| notes | TEXT | nullable |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | auto-updated |

### `client_checklist_items`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| organization_id | UUID FK | → organizations |
| client_id | UUID FK | → clients |
| label | TEXT | checklist item text |
| completed | BOOLEAN | default false |
| completed_at | TIMESTAMPTZ | nullable |
| sort_order | INTEGER | display order |
| created_at | TIMESTAMPTZ | |

### `websites`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| organization_id | UUID FK | → organizations |
| client_id | UUID FK | → clients (nullable) |
| name | TEXT | project name |
| domain | TEXT | nullable |
| hosting_provider | TEXT | nullable |
| email_provider | TEXT | nullable |
| status | TEXT | not_started / in_progress / review / live / maintenance |
| launch_date | DATE | nullable |
| notes | TEXT | nullable |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | auto-updated |

### `website_checklist_items`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| organization_id | UUID FK | → organizations |
| website_id | UUID FK | → websites |
| category | TEXT | launch / assets |
| label | TEXT | checklist item text |
| completed | BOOLEAN | default false |
| completed_at | TIMESTAMPTZ | nullable |
| sort_order | INTEGER | display order |
| created_at | TIMESTAMPTZ | |

### `website_revisions`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| organization_id | UUID FK | → organizations |
| website_id | UUID FK | → websites |
| description | TEXT | required |
| status | TEXT | requested / in_progress / completed |
| priority | TEXT | low / medium / high |
| created_at | TIMESTAMPTZ | |
| completed_at | TIMESTAMPTZ | nullable |

---

## Technical Debt

- **User Profile page not built** — sidebar shows name/email but no /settings/profile page yet
- **Git line endings** — CRLF warnings on every commit (Windows); add `.gitattributes` to normalise
- **Database types hand-written** — `types/database.ts` is manually maintained; generate from Supabase CLI eventually
- **No loading states** — forms show "Saving…" but pages have no skeleton loaders during navigation
- **Contact list: no pagination** — full list loaded, fine for now but needs pagination at scale
- **Contacts not filterable by client** — could be useful on the client detail page
- **Archived contacts not viewable** — archived contacts are hidden with no way to view/restore list; only restorable from the detail URL if you know the ID

---

## Notes

### Architecture Decisions
- **Multi-tenancy via shared schema + RLS** — every table has `organization_id`, RLS policies enforce isolation.
- **Server Components + Server Actions** — no separate API routes. Data fetched server-side, mutations via server actions.
- **URL-based search/filter** — search state lives in the URL, not React state. Pages are shareable and server-rendered.
- **Next.js 16 proxy.ts** — Next.js 16 renamed `middleware.ts` to `proxy.ts`. Export must be named `proxy`.
- **Supabase Database types require `Relationships: []`** — without this field TypeScript infers `never` for all queries.
- **Trigger functions need `SET search_path = public`** — required for Supabase triggers on `auth.users`.
- **Soft delete pattern** — `archived_at TIMESTAMPTZ` column, null = active, set = archived. No hard deletes on contacts.
- **Default onboarding checklist** — 10 standard items inserted automatically when a client is created.
- **Default website checklists** — 14 launch items + 9 asset items inserted automatically when a website is created.
- **Base UI Select `onValueChange`** — passes `string | null`, not `string`. Always guard with `val && handler(val)`.

### Deployment
- **Repo:** github.com/ryderwebsolutions/RyderOS
- **Hosting:** Vercel (auto-deploys on push to main)
- **Domain:** ryderos.com
- **Database:** Supabase (project: yumxrlnpdjrnynqdwmli)
- **Migrations run:** 001_initial_schema, 002_contacts, 003_contacts_v2, 004_clients
- **Migration pending (not yet run):** 005_websites — run this in Supabase SQL Editor before using /websites
