# Ask Mode Rules

## Non-Obvious Documentation Context

### URL Path Quirk
- DevUser routes appear duplicated in code but NOT in URL
- Code path: `app/(devuser)/devuser/survey/` → URL: `/devuser/survey` (never `/devuser/devuser/survey`)

### Content Language
- All user-facing content is in Turkish (tr)
- Target audience: Turks living in or moving to Germany
- Site URL: https://almanya101.com

### Feature Modules
- `lib/salary/` - German salary calculation (tax, social insurance, company car)
- `lib/rehber/` - Guide data and types
- `lib/utils/holiday-calculator.ts` - German holiday calculations
