# RyderOS Progress Tracker

## Current Layer

Layer 2 — Core CRM

## Current Milestone

Completing Layer 2 — Notes/activity log, website field on contact, archive vs delete

---

## Completed Layers

### Layer 1 — Foundation

* [x] Authentication (signup, email confirmation, login, logout)
* [x] Dashboard (shell with stat placeholder cards)
* [x] Navigation (sidebar with Dashboard, CRM, Leads, Tasks, Settings links)
* [ ] User Profile (name/email visible in sidebar but no dedicated profile page)
* [x] App Layout (dashboard layout with protected route wrapper)
* [x] Database Foundation (organizations, profiles, organization_members, RLS, triggers)

### Layer 2 — Core CRM

* [x] Contacts Table (id, organization_id, first/last name, email, phone, company, source, status, notes)
* [x] Add Contact (form with all fields, server action)
* [x] Contact List (server-rendered, paginated by creation date)
* [x] Contact Detail Page (view contact with all fields)
* [x] Edit Contact (edit form pre-populated, server action)
* [x] Status Labels (lead / prospect / client / inactive with colour-coded badges)
* [x] Search & Filters (URL-based search + status filter buttons)
* [ ] Notes (basic textarea exists — needs dedicated timestamped activity log)
* [ ] Website URL field on contact (field missing from current schema)
* [ ] Archive vs delete (currently hard delete — needs soft delete/archived flag)

### Layer 3 — Client Management

* [ ] Clients Table
* [ ] Client Profiles
* [ ] Client Status
* [ ] Onboarding Checklist
* [ ] Retainer Tracking
* [ ] Payment Tracking

### Layer 4 — Website Management

* [ ] Websites Table
* [ ] Website Projects
* [ ] Website Status Tracking
* [ ] Launch Checklist
* [ ] Revision Tracking
* [ ] Asset Tracking
* [ ] Maintenance Tracking

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
| first_name | TEXT | required |
| last_name | TEXT | nullable |
| email | TEXT | nullable |
| phone | TEXT | nullable |
| company_name | TEXT | nullable |
| source | TEXT | nullable (website/referral/social/cold outreach/other) |
| status | TEXT | lead / prospect / client / inactive |
| notes | TEXT | nullable — to be replaced with activity log |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | auto-updated by trigger |

---

## Technical Debt

- **Contacts: no website URL field** — needs to be added to schema and form
- **Contacts: hard delete** — should be soft delete with `archived_at` timestamp so data is recoverable
- **Contacts: notes is a textarea** — should be a dedicated `contact_notes` table with timestamps and author
- **User Profile page not built** — sidebar shows name/email but no /settings/profile page yet
- **Git line endings** — CRLF warnings on every commit (Windows); add `.gitattributes` to normalise
- **Database types hand-written** — `types/database.ts` is manually maintained; should eventually be generated from Supabase CLI (`supabase gen types`)
- **No loading states** — forms show "Saving…" but pages have no skeleton loaders during navigation

---

## Next Recommended Milestone

**Complete Layer 2 before moving to Layer 3.**

Three items remaining:
1. Add `website_url` field to contacts table and form
2. Add `archived_at` soft-delete to contacts (hide archived from list, recoverable)
3. Replace notes textarea with a dedicated `contact_notes` table (timestamped, author-tracked)

Once those are done → **Layer 3: Client Management**

---

## Notes

### Architecture Decisions
- **Multi-tenancy via shared schema + RLS** — every table has `organization_id`, RLS policies enforce isolation. Correct approach for Supabase at this scale.
- **Server Components + Server Actions** — no separate API routes. Data fetched server-side, mutations via server actions. Clean, secure, fast.
- **URL-based search/filter** — search state lives in the URL, not React state. Pages are shareable and server-rendered.
- **Next.js 16 proxy.ts** — Next.js 16 renamed `middleware.ts` to `proxy.ts`. Export must be named `proxy` not `middleware`.
- **Supabase Database types require `Relationships: []`** — without this field on every table definition, TypeScript infers `never` for all query results.
- **Trigger functions need `SET search_path = public`** — required for Supabase triggers on `auth.users` to resolve table names correctly.

### Deployment
- **Repo:** github.com/ryderwebsolutions/RyderOS
- **Hosting:** Vercel (auto-deploys on push to main)
- **Domain:** ryderos.com
- **Database:** Supabase (project: yumxrlnpdjrnynqdwmli)
- **Migrations:** run manually in Supabase SQL Editor (files in `/supabase/migrations/`)
