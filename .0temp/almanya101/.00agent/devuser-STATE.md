# SYSTEM STATE

Last Updated: 2026-03-03
Updated By: Claude Code

---

# Project Overview

Name:
DevUser

Description:
Community platform for Turkish tech professionals in Germany

Environment:
production

Domain:
https://almanya101.de/devuser/

---

# Infrastructure

Hosting:
Static hosting (almanya101.de via Vercel)

Backend:
Supabase (managed cloud)

Containerization:
NONE

Kubernetes:
NONE

VM:
NONE

CRITICAL:
No Express, Fiber, Go backend, systemd service.
All backend logic lives in Supabase Edge Functions.

---

# Frontend

Type:
Static HTML + Vanilla JS (no framework)

Files:
- du.html (~1078 lines, 30-step wizard)
- list.html (~340 lines, member listing)
- devuser.css (form styles)
- devuserlist.css (list styles)

Status:
ACTIVE

---

# Backend

Platform:
Supabase Edge Functions

Functions:
- get-users (GET, member listing with filters)
- register-user (POST, new member registration)

Language:
Deno / TypeScript

Location:
supabase/functions/

Status:
ACTIVE

---

# Database

Provider:
Supabase PostgreSQL

Main Table:
devuser

Public View:
devuser_public (filters sensitive fields)

RLS:
ENABLED (anon users cannot access table directly)

Migrations:
supabase/migrations/

---

# Security

Origin Control:
ENABLED
Allowed: almanya101.de, devuser.vercel.app, localhost:3000
NEVER: "*"

Rate Limiting:
ENABLED (30 req/min, in-memory)

Input Validation:
ENABLED (all required fields, URL format, phone format)

Duplicate Check:
ENABLED (LinkedIn URL, WhatsApp, name in 24h)

Secure View:
devuser_public filters WhatsApp by iletisim_izni

CSP (Content-Security-Policy):
ENABLED
script-src: 'self' 'unsafe-inline' cdn.jsdelivr.net cdn.tailwindcss.com gc.zgo.at www.clarity.ms
style-src: 'self' 'unsafe-inline' cdn.jsdelivr.net cdn.tailwindcss.com fonts.googleapis.com
font-src: 'self' data: fonts.gstatic.com
connect-src: 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co cdn.jsdelivr.net
img-src: 'self' data: https:
frame-ancestors: 'none'

---

# Deployment

Method:
- Edge Functions: supabase functions deploy
- SQL: supabase db push
- Frontend: Static file upload (Vercel)

Project Ref:
ldptefnpiudquipdsezr

Status:
ACTIVE

---

# Known Issues

- Pagination not implemented on frontend
- Rate limiting resets on Edge restart (in-memory)
- Origin control open to localhost for development

---

# Pending Tasks

- Authentication system (profile editing)
- Admin panel
- Frontend pagination

---

# Change Log

2026-03-03
Initial state created

2026-03-03
State updated by Claude Code after documentation review
- Added project description
- Added detailed file list
- Added Vercel hosting info
- Added project ref
- Added security details (allowed origins)
- Clarified no-server-backend rule

2026-03-03
CSP Fix applied (vercel.json)
- Added gc.zgo.at, www.clarity.ms to script-src (analytics)
- Added fonts.googleapis.com to style-src (Google Fonts CSS)
- Added fonts.gstatic.com to font-src (Google Fonts)
- Added wss://*.supabase.co to connect-src (Supabase Realtime)
- Added cdn.jsdelivr.net to connect-src (source maps)
- See: devuser/.docs/CSP_FIX_TRACKING.md

2026-03-03
Security Hardening - Config & RLS
- Moved Supabase config to API endpoint (/api/supabase-config.js)
- Config now loaded from environment variables
- Created migration to fix tournament table RLS policies
- Created public views that hide WhatsApp/LinkedIn
- Anon users can INSERT but cannot SELECT from main tables
- Updated typing.html to use public views for SELECT
- See: devuser/.docs/CSP_FIX_TRACKING.md