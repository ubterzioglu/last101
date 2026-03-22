We are running security validation for DevUser production.

Verify:

1. Direct table access with anon key fails.
2. devuser_public view filters correctly.
3. WhatsApp visibility respects iletisim_izni.
4. Rate limiting returns 429 after threshold.
5. Origin check blocks unknown domains.
6. No API keys exposed in frontend.

List any security gaps found.
Do NOT assume everything is safe