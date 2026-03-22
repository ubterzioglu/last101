# DEVUSER — SYSTEM BOOTSTRAP

Minimal system overview.

Always trust STATE.md over this file.

---

# PROJECT TYPE

Community platform for Turkish tech professionals in Germany.

Static frontend + Supabase backend.

Domain:
https://almanya101.de/devuser/

---

# INFRASTRUCTURE

Hosting:
Static hosting (almanya101.de)

Backend:
Supabase (managed cloud)

Database:
PostgreSQL (Supabase managed)

API:
Supabase Edge Functions (Deno/TypeScript)

---

# MAIN COMPONENTS

Frontend:

du.html        → Registration wizard  
list.html      → Member listing  
CSS files      → Separate per page  

No frontend framework.

Vanilla JavaScript only.

---

Edge Functions:

get-users  
register-user  

Located in:

supabase/functions/

---

Database:

Table:
devuser

View:
devuser_public

RLS:
Enabled

---

# SECURITY MODEL

Security layers:

- Origin control
- Rate limiting (in-memory)
- Input validation
- Duplicate checks
- Secure public view
- RLS policies

Anonymous users CANNOT access table directly.

---

# DEPLOYMENT

Edge Functions:

supabase functions deploy

SQL:

supabase db push

Frontend:

Upload static files to hosting

---

# CRITICAL RULE

This is NOT a server-based backend.

There is no:

- Express server
- Fiber server
- Go backend
- systemd service

All backend logic lives inside Supabase Edge Functions.

---

# DOCUMENTATION INDEX

Load only if required:

README.md  
KURULUM.md  
plans/project-analysis.md  
plans/security-fix-plan.md  

---

# END