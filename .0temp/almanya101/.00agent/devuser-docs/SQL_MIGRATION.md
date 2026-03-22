We are about to modify database schema.

Before writing SQL:

1. Confirm current schema from STATE.md.
2. Preserve RLS policies.
3. Do NOT remove security constraints.
4. Use explicit DROP POLICY IF EXISTS before creating new ones.
5. Ensure devuser_public view remains secure.

After generating SQL:
Explain impact on:
- RLS
- Public view
- Edge Functions

Do NOT weaken secury