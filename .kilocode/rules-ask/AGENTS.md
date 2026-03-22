# Ask Mode Rules

## Content Language

- All user-facing content is in Turkish (tr)
- Target audience: Turks living in or moving to Germany
- Site URL: https://almanya101.com

## Route Organization

- `app/(marketing)/` - Public marketing pages (almanyada-yasam, is-ilanlari, rehber, tatil, para-transferi, topluluk, hakkimizda, iletisim)
- `app/(site)/` - Interactive tools (banka-secim, sigorta-secim, maas-hesaplama, vatandaslik-testi, hizmet-rehberi)
- `app/(devuser)/devuser/` - Dashboard pages (cvopt, disad, discussion, du, e1, e1a, e2, e2a, gelismeler, list, news, profile-edit, promote, reset-password, summary, survey, tavla, typing, ubt, vct)

## Feature Modules

- `lib/salary/` - German salary calculation (tax, social insurance, company car)
- `lib/rehber/` - Guide data and types
- `lib/utils/holiday-calculator.ts` - German holiday calculations
