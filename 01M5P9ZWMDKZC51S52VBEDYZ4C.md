# Audit Report: https://almanya101.de

**64 pages**
Generated: 2026-10-24T06:36:09.445Z
_This published report is a summary: each issue lists up to 10 example pages and 5 items beside its true counts. The complete list is not stored with this report: audit the site with the squirrel CLI and run `squirrel report --format json` for every page._
**Not checked: Broken External Links. 42 of 242 external link\(s\) were not checked: over this audit's limit of 200, which checks the most-linked first. Raise the page limit, which raises the external link limit with it, to check them.**

## Editor's Summary

_Auto-generated editor's summary — informational, not scored._

Bottom line: this is a mixed site, with accessibility, performance, and content needing the most work. Accessibility is the weak spot among the stronger categories, while mobile, crawlability, and site integrity are healthy. The audit found repeated unlabeled form controls, oversized DOMs, title and description warnings, and one structured-data identity failure; it also found no failing legal-compliance checks, though the privacy-policy check warns.

This was a partial audit: 34 pages were scanned, and 26 found pages were not fetched because the run hit its time limit. Raise the audit level or page limit \(\`--level\` or \`--max-pages\` in the CLI, or the website’s audit settings in the cloud\) to cover more pages; see docs.squirrelscan.com/guides/audit-levels. This is the first run, so there is no previous audit to compare.

**Verdict:** A mixed site: healthy foundations, but accessibility and performance failures need attention, and the crawl was incomplete.

## Priorities

1. **Label every form control and fix page landmarks** (Moderate)
   Accessibility has 13 failing checks, including repeated unnamed selects and inputs that can make forms unusable to assistive-technology users.  
   In the React components that render forms, give each select and input a programmatic label or accessible name, and ensure each page renders exactly one main landmark.

2. **Reduce page weight and fix image loading** (Significant)
   Performance has a failing DOM-size check and widespread request-chain warnings, while image-size and loading warnings add to the burden on page loads.  
   In Next.js, serve site images through \`next/image\`, set \`fetchpriority="high"\` on the LCP image and do not lazy-load it; also reduce oversized DOMs, minify JavaScript in the Webpack build, and review caching and critical request chains.

3. **Correct metadata and clean up page content** (Moderate)
   Meta titles and descriptions are warned on many pages, and the audit also found metadata in the body, unrendered markup, keyword stuffing, and thin-page warnings.  
   In the Next.js page metadata definitions, provide accurate titles and descriptions and keep metadata out of rendered body markup; remove unrendered markup and revise keyword-stuffed or thin content.

4. **Fix structured entity identity and complete trust information** (Moderate)
   The entity-identity failure weakens the site's structured data, and the audit flags privacy-policy and about/contact-page information.  
   Correct the entity identity in the structured-data output, and make the privacy policy, about, and contact information easy to find on the site.

5. **Publish an AI-readable site guide and set crawler policy** (Moderate)
   Publishing a clear list of key pages and choosing an AI crawler policy makes the site's intended access explicit.  
   Publish \`/llms.txt\` listing key pages, serve Markdown versions of content pages where the platform allows, and deliberately choose which AI crawlers may read the site.

## Health Score: 81/100 (B)

| Category | Score |
| --- | --- |
| Accessibility | 91% |
| Content | 53% |
| Performance | 72% |
| Structured Data | 91% |
| Core SEO | 74% |
| Agent Experience | 53% |
| Images | 85% |
| Crawlability | 85% |
| E-E-A-T | 76% |
| Security | 91% |
| Links | 87% |
| Legal Compliance | 76% |
| Mobile | 96% |
| Blocking | 100% |
| Analytics | 100% |
| Internationalization | 100% |
| Site Integrity | 100% |
| Local SEO | 100% |
| Reliability | 100% |
| Social Media | 100% |
| URL Structure | 100% |
| Video | 100% |

## Summary

| Metric | Value |
| --- | --- |
| Pages | 64 |
| Passed | 3968 |
| Warnings | 315 |
| Failed | 41 |

## Issues

### Content

#### Meta Tags in Body
> Detects meta tags incorrectly placed in document body
_10 of 12 pages carried from previous crawls._
- [X] **meta-in-body**: Found 26 meta tag(s) in <body> (+1 more pages)
  (2 pages)
  - /haberler/fransa-daki-eylemlerde-149-kisi-tutuklandi--1cf8c927-72eb-4019-83e0-92f0ec4334a5
  - /hizmet-rehberi
- [X] **meta-in-body**: Found 27 meta tag(s) in <body> _(Not re-checked this run — last verified 2 days ago.)_
  (29 pages)
  - /almanya-maas-beklentisi (carried)
  - /almanya-yasam-tarzi-uyumu (carried)
  - /almanya-yolunu-sec (carried)
  - /almanyada-is-bulma-olasiligi (carried)
  - /almanyaya-hazir-misin (carried)
  - ... +24 more pages

#### Keyword Stuffing
> Detects excessive keyword repetition in content
- [!] **keyword-stuffing**: 2 word(s) may be overused (+5 more pages)
  (6 pages)
  - /almanya-araclari
  - /ekibimize-katil
  - /is-ilanlari
  - /tatil
  - /yazi-dizisi
  - ... +1 more pages

#### Unrendered Markup
> Detects literal markdown or escaped HTML leaking into rendered copy
- [X] **unrendered-markup**: 73 unrendered markup occurrence(s) in visible text (markdown-emphasis): example *Anmeldung der Wohnung*
  (1 pages)
  - /belgeler

#### Date Agreement
> Checks the visible date, schema dates and URL/title year agree
- [!] **visible-date-missing**: This Article states datePublished 2026-10-21T06:01:16.783251+00:00 in its schema but shows the reader no date at all (+11 more pages)
  (12 pages)
  - /haberler/7-ilde-bahis-operasyonunda-22-tutuklama--d1a48869-91c3-4507-9915-496db5a6480a
  - /haberler/almanya-akaryakitta-gecici-vergi-indirimi-karari-aldi--2b9af277-5803-458b-a1f9-5a02abde8900
  - /haberler/brezilya-da-meta-ya-devlet-baskani-adaylarina-esit-muameleyi-belgelemesi-icin-24-saat-sure--b4939ee2-a149-44b1-9690-d0b43dd2cda3
  - /haberler/cdu-icinde-reiche-krizi-gorevden-alma-cagrisi-yukseliyor--973c2485-7f6f-475d-8e91-6fc1f3741636
  - /haberler/fransa-daki-eylemlerde-149-kisi-tutuklandi--1cf8c927-72eb-4019-83e0-92f0ec4334a5
  - ... +7 more pages

#### Word Count
> Checks content length for thin content issues
_7 of 17 pages carried from previous crawls._
- [!] **word-count**: Thin content: 144 words (min 300) _(Not re-checked this run — last verified 2 days ago.)_
  (54 pages)
  - /almanya-maas-beklentisi (carried)
  - /almanya-yasam-tarzi-uyumu (carried)
  - /almanya-yolunu-sec (carried)
  - /almanyada-is-bulma-olasiligi (carried)
  - /almanyaya-hazir-misin (carried)
  - ... +49 more pages
- [!] **word-count**: Thin content: 153 words (min 300) (+23 more pages)
  (24 pages)
  - /almanyada-yasam
  - /blog
  - /ekibimize-katil
  - /gizlilik-politikasi
  - /haberler/7-ilde-bahis-operasyonunda-22-tutuklama--d1a48869-91c3-4507-9915-496db5a6480a
  - ... +19 more pages

### Structured Data

#### Entity Identity
> Finds an Organization, LocalBusiness, Person or WebSite declared on many pages with no @id to tie the declarations together
- [X] **entity-identity**: 2 entities are declared on several pages with no @id
  (10 pages)
  - /haberler/7-ilde-bahis-operasyonunda-22-tutuklama--d1a48869-91c3-4507-9915-496db5a6480a
  - /
  - ... +8 more pages

#### LocalBusiness Schema
> Validates LocalBusiness schema for local SEO
- [!] **local-business-address**: Address incomplete _(Not re-checked this run — last verified 2 days ago.)_
  (64 pages)
  - /almanya-maas-beklentisi (carried)
  - /almanya-yasam-tarzi-uyumu (carried)
  - /almanya-yolunu-sec (carried)
  - /almanyada-is-bulma-olasiligi (carried)
  - /almanyaya-hazir-misin (carried)
  - ... +59 more pages

### Accessibility

#### Select Name
> Checks that select elements have accessible names
- [X] **select-name**: 1 select element(s) without accessible names (+2 more pages)
  (3 pages)
  - /hizmet-rehberi
  - /is-ilanlari
  - /tatil/almanya

#### ARIA Input Field Name
> Checks that input fields have accessible names
- [X] **aria-input-field-name**: 1 input field(s) without accessible names (+3 more pages)
  (4 pages)
  - /hizmet-rehberi
  - /is-ilanlari
  - /tatil/almanya
  - /tatil/turkiye

#### Form Labels
> Checks that form inputs have associated labels
- [X] **form-labels**: 2 form input(s) without labels (+3 more pages)
  (4 pages)
  - /hizmet-rehberi
  - /is-ilanlari
  - /tatil/almanya
  - /tatil/turkiye

#### Landmark Regions
> Checks for proper landmark regions (main, nav, footer)
_9 of 11 pages carried from previous crawls._
- [!] **landmark-main**: Multiple main landmarks (2) _(Not re-checked this run — last verified 2 days ago.)_
  (30 pages)
  - /almanya-maas-beklentisi (carried)
  - /almanya-yasam-tarzi-uyumu (carried)
  - /almanya-yolunu-sec (carried)
  - /almanyada-is-bulma-olasiligi (carried)
  - /almanyaya-hazir-misin (carried)
  - ... +25 more pages
- [!] **landmark-main**: Multiple main landmarks (2) (+1 more pages)
  (2 pages)
  - /almanya-araclari
  - /yeniarachub

#### One Main Landmark
> Checks that the page has exactly one main landmark
_9 of 11 pages carried from previous crawls._
- [X] **landmark-one-main**: Page has 2 main landmarks (should be 1) _(Not re-checked this run — last verified 2 days ago.)_
  (30 pages)
  - /almanya-maas-beklentisi (carried)
  - /almanya-yasam-tarzi-uyumu (carried)
  - /almanya-yolunu-sec (carried)
  - /almanyada-is-bulma-olasiligi (carried)
  - /almanyaya-hazir-misin (carried)
  - ... +25 more pages
- [X] **landmark-one-main**: Page has 2 main landmarks (should be 1) (+1 more pages)
  (2 pages)
  - /almanya-araclari
  - /yeniarachub

#### Identical Links Same Purpose
> Checks that links with identical text go to the same destination
- [!] **identical-links-same-purpose**: 1 link text(s) lead to different destinations (+2 more pages)
  (3 pages)
  - /
  - /almanya-araclari
  - /yeniarachub

#### Redundant Image Alt
> Checks that image alt text is not redundant with surrounding text
- [!] **image-redundant-alt**: 1 image(s) with redundant alt text _(Not re-checked this run — last verified 2 days ago.)_
  (28 pages)
  - /almanya-maas-beklentisi (carried)
  - /almanya-yasam-tarzi-uyumu (carried)
  - /almanya-yolunu-sec (carried)
  - /almanyada-is-bulma-olasiligi (carried)
  - /almanyaya-hazir-misin (carried)
  - ... +23 more pages

### Security

#### Third-Party Cookies
> Detects third-party resources that may set cookies
- [!] **tracking-domains**: 2 known tracking domain(s) detected _(Not re-checked this run — last verified 2 days ago.)_
  (1 pages)
  - /cerez-politikasi (carried)

#### Content Security Policy
> Checks for Content-Security-Policy header and validates directives
- [!] **csp-missing**: No Content-Security-Policy header

#### HSTS Header
> Checks for HTTP Strict Transport Security header
- [!] **hsts**: Missing Strict-Transport-Security header

#### Subresource Integrity
> Checks that cross-origin scripts and stylesheets use Subresource Integrity (SRI)
- [!] **sri**: 2 cross-origin resource(s) without Subresource Integrity _(Not re-checked this run — last verified 2 days ago.)_
  (1 pages)
  - /cerez-politikasi (carried)

#### security.txt
> Checks for a valid RFC 9116 security.txt so security researchers know how to report a vulnerability
- [!] **security-txt**: No security.txt at /.well-known/security.txt (RFC 9116 vulnerability-disclosure contact)

### Links

#### Tel & Mailto Links
> Validates tel: and mailto: link formats
- [!] **mailto-mismatch**: 1 mailto link(s) have mismatched email in href vs display text
  (1 pages)
  - /ekibimize-katil

#### Broken External Links
> Detects external links returning 4xx/5xx errors or timeouts
- [!] **broken-external-links**: 1 broken external link(s): 1 with 530
  (1 pages)
  - /hakkimizda

#### Orphan Pages
> Detects pages with no internal links pointing to them
- [!] **orphan-pages**: 11 orphan page(s) with <2 incoming links
  (11 pages)
  - /almanya-araclari
  - /almanyada-yasam
  - /blog
  - /haberler/7-ilde-bahis-operasyonunda-22-tutuklama--d1a48869-91c3-4507-9915-496db5a6480a
  - /haberler/brezilya-da-meta-ya-devlet-baskani-adaylarina-esit-muameleyi-belgelemesi-icin-24-saat-sure--b4939ee2-a149-44b1-9690-d0b43dd2cda3
  - ... +6 more pages

#### Weak Internal Links
> Detects pages with only 1 dofollow internal link pointing to them
- [!] **weak-internal-links**: 9 page(s) have only 1 internal link
  (9 pages)
  - /almanya-araclari
  - /almanyada-yasam
  - /blog
  - /haberler/7-ilde-bahis-operasyonunda-22-tutuklama--d1a48869-91c3-4507-9915-496db5a6480a
  - /haberler/brezilya-da-meta-ya-devlet-baskani-adaylarina-esit-muameleyi-belgelemesi-icin-24-saat-sure--b4939ee2-a149-44b1-9690-d0b43dd2cda3
  - ... +4 more pages

### Images

#### Image Optimization
> Checks for image optimization indicators
- [!] **image-optimization-needed**: Images may not be optimized - consider using an image CDN (+13 more pages)
  (14 pages)
  - /haberler
  - /haberler/7-ilde-bahis-operasyonunda-22-tutuklama--d1a48869-91c3-4507-9915-496db5a6480a
  - /haberler/almanya-akaryakitta-gecici-vergi-indirimi-karari-aldi--2b9af277-5803-458b-a1f9-5a02abde8900
  - /haberler/brezilya-da-meta-ya-devlet-baskani-adaylarina-esit-muameleyi-belgelemesi-icin-24-saat-sure--b4939ee2-a149-44b1-9690-d0b43dd2cda3
  - /haberler/cdu-icinde-reiche-krizi-gorevden-alma-cagrisi-yukseliyor--973c2485-7f6f-475d-8e91-6fc1f3741636
  - ... +9 more pages

#### Image File Size Too Large
> Checks for image files that exceed recommended size limits
- [!] **image-file-size-warn**: 6 image(s) exceed 200.0 KB
  (1 pages)
  - /

#### Offscreen Image Lazy Loading
> Checks if offscreen images use lazy loading
- [!] **offscreen-images-not-lazy**: 1 below-fold image(s) without lazy loading
  (1 pages)
  - /

#### Image Dimensions
> Checks for width/height attributes (prevents CLS)
- [!] **image-dimensions**: 40 image(s) missing width/height (causes CLS) (+14 more pages)
  (15 pages)
  - /
  - /haberler
  - /haberler/7-ilde-bahis-operasyonunda-22-tutuklama--d1a48869-91c3-4507-9915-496db5a6480a
  - /haberler/almanya-akaryakitta-gecici-vergi-indirimi-karari-aldi--2b9af277-5803-458b-a1f9-5a02abde8900
  - /haberler/brezilya-da-meta-ya-devlet-baskani-adaylarina-esit-muameleyi-belgelemesi-icin-24-saat-sure--b4939ee2-a149-44b1-9690-d0b43dd2cda3
  - ... +10 more pages

### URL Structure

#### URL Length
> Checks URL length for optimal SEO
- [!] **url-length**: URL is 108 characters (over 100) (+11 more pages)
  (12 pages)
  - /haberler/7-ilde-bahis-operasyonunda-22-tutuklama--d1a48869-91c3-4507-9915-496db5a6480a
  - /haberler/almanya-akaryakitta-gecici-vergi-indirimi-karari-aldi--2b9af277-5803-458b-a1f9-5a02abde8900
  - /haberler/brezilya-da-meta-ya-devlet-baskani-adaylarina-esit-muameleyi-belgelemesi-icin-24-saat-sure--b4939ee2-a149-44b1-9690-d0b43dd2cda3
  - /haberler/cdu-icinde-reiche-krizi-gorevden-alma-cagrisi-yukseliyor--973c2485-7f6f-475d-8e91-6fc1f3741636
  - /haberler/fransa-daki-eylemlerde-149-kisi-tutuklandi--1cf8c927-72eb-4019-83e0-92f0ec4334a5
  - ... +7 more pages

### Legal Compliance

#### Cookie Consent
> Checks for cookie consent mechanism
- [!] **cookie-consent**: No cookie consent mechanism detected — required for your EU/UK (GDPR) audience _(Not re-checked this run — last verified 2 days ago.)_
  (64 pages)
  - /almanya-maas-beklentisi (carried)
  - /almanya-yasam-tarzi-uyumu (carried)
  - /almanya-yolunu-sec (carried)
  - /almanyada-is-bulma-olasiligi (carried)
  - /almanyaya-hazir-misin (carried)
  - ... +59 more pages

#### Privacy Policy
> Checks for privacy policy link presence
- [!] **privacy-policy**: No privacy policy link found across site

### Agent Experience

#### LLM Parsability
> Analyzes how well LLMs can parse and understand the content
- [!] **llm-parsability**: LLM parsability could be improved: 40/100 _(Not re-checked this run — last verified 2 days ago.)_
  (15 pages)
  - /giris (carried)
  - /giris (carried)
  - /giris (carried)
  - /hangi-sehir-sana-uygun (carried)
  - /ilk-90-gun-planlayici (carried)
  - ... +10 more pages

#### AGENTS.md
> Detects /AGENTS.md (and variants) — plain-Markdown instructions for coding agents working against the site's repository
- [!] **agents-md-present**: No AGENTS.md found — this site publishes llms.txt, so consider an AGENTS.md for coding agents too

#### Markdown Response
> Checks whether the site serves text/markdown via content negotiation (Accept: text/markdown) or exposes a .md variant of the homepage — agents increasingly prefer clean Markdown over rendered HTML
- [!] **markdown-response**: No Markdown response — consider honoring Accept: text/markdown or publishing a .md variant so agents get clean content

#### Token Weight
> Estimates the LLM token cost of a page's raw HTML and reports the text-to-HTML ratio — how much of that cost is actual content versus markup, scripts, and styles
_6 of 17 pages carried from previous crawls._
- [!] **token-weight-budget**: Raw HTML exceeds a generous 100,000-token budget for a single page fetch — too heavy for an agent's context window
  (1 pages)
  - /is-ilanlari
- [!] **token-weight-ratio**: Visible text is under 15% of the page HTML — agents pay token cost mostly for markup, scripts, and styles _(Not re-checked this run — last verified 2 days ago.)_
  (64 pages)
  - /almanya-maas-beklentisi (carried)
  - /almanya-yasam-tarzi-uyumu (carried)
  - /almanya-yolunu-sec (carried)
  - /almanyada-is-bulma-olasiligi (carried)
  - /almanyaya-hazir-misin (carried)
  - ... +59 more pages
- [!] **token-weight-ratio**: Visible text is under 15% of the page HTML — agents pay token cost mostly for markup, scripts, and styles (+33 more pages)
  (34 pages)
  - /
  - /almanya-araclari
  - /almanyada-yasam
  - /belgeler
  - /blog
  - ... +29 more pages

### Crawlability

#### Canonical Chain
> Checks for redirect chains on canonical URLs
- [!] **page-redirect-chain**: Page redirects before content is served _(Not re-checked this run — last verified 2 days ago.)_
  (18 pages)
  - /almanya-maas-beklentisi (carried)
  - /almanya-yasam-tarzi-uyumu (carried)
  - /almanya-yolunu-sec (carried)
  - /almanyada-is-bulma-olasiligi (carried)
  - /almanyaya-hazir-misin (carried)
  - ... +13 more pages

#### Sitemap Coverage
> Checks for indexable pages that are not in the sitemap
- [!] **sitemap-orphans**: 2 sitemap URL(s) were not crawled
  (2 pages)
  - /cerez-politikasi
  - /kvkk-gdpr-ccpa

#### Sitemap Lastmod Drift
> Checks that sitemap lastmod matches the page's own dateModified
- [!] **sitemap-lastmod-ahead-of-page**: 4 page(s) have a sitemap lastmod newer than the page's own dateModified by more than 30 day(s)
  (4 pages)
  - /haberler/almanya-akaryakitta-gecici-vergi-indirimi-karari-aldi--2b9af277-5803-458b-a1f9-5a02abde8900
  - /haberler/cdu-icinde-reiche-krizi-gorevden-alma-cagrisi-yukseliyor--973c2485-7f6f-475d-8e91-6fc1f3741636
  - /haberler/hastalik-iznine-kesinti-gelebilir--e7aee0ae-c9ad-4828-90b8-842df610f8ff
  - /haberler/lufthansa-da-iki-gun-surecek-pilot-grevi-basladi--5c52e180-6a70-434d-9de6-589c00818579

### Core SEO

#### Meta Title
> Validates page title presence and length
_1 of 11 pages carried from previous crawls._
- [!] **meta-title**: Title too short _(Not re-checked this run — last verified 2 days ago.)_
  (22 pages)
  - /cerez-politikasi (carried)
  - ... +21 more pages
- [!] **meta-title**: Title too short (+19 more pages)
  (20 pages)
  - /almanyada-yasam
  - /belgeler
  - /blog
  - /ekibimize-katil
  - /haberler
  - ... +15 more pages

#### Meta Description
> Validates meta description presence and length
- [!] **meta-description**: Description too short (+23 more pages)
  (24 pages)
  - /almanya-araclari
  - /almanyada-yasam
  - /belgeler
  - /ekibimize-katil
  - /haberler
  - ... +19 more pages

#### Robots Meta
> Checks the robots meta tag and X-Robots-Tag header for indexing directives
- [!] **robots-meta**: Page is set to noindex and nofollow via robots meta tag _(Not re-checked this run — last verified 2 days ago.)_
  (28 pages)
  - /almanya-maas-beklentisi (carried)
  - /almanya-yasam-tarzi-uyumu (carried)
  - /almanya-yolunu-sec (carried)
  - /almanyada-is-bulma-olasiligi (carried)
  - /almanyaya-hazir-misin (carried)
  - ... +23 more pages

### Performance

#### DOM Size
> Detects excessive DOM complexity that impacts performance
- [!] **dom-max-children**: Element with 87 children found (+1 more pages)
  (2 pages)
  - /
  - /is-ilanlari
- [X] **dom-total-nodes**: Excessive DOM size (3682 nodes)
  (1 pages)
  - /is-ilanlari
- [!] **dom-total-nodes**: Large DOM (2454 nodes)
  (1 pages)
  - /belgeler

#### Total Page Weight
> Checks the byte weight of each page
- [!] **total-byte-weight**: Heaviest page: https://almanya101.de/ 4495KB (1 over 1600KB, 0 over 5000KB) (heavy page). Not scored: site total 7228KB across 34 pages, shared files counted once; average page 1087KB

#### Weak Caching (site-wide)
> Flags sites where most pages lack caching freshness, validators, or compression
- [!] **bad-caching-validators**: 17/34 pages lack an ETag or Last-Modified validator
  (5 pages)
  - /
  - /haberler
  - /haberler/7-ilde-bahis-operasyonunda-22-tutuklama--d1a48869-91c3-4507-9915-496db5a6480a
  - /haberler/almanya-akaryakitta-gecici-vergi-indirimi-karari-aldi--2b9af277-5803-458b-a1f9-5a02abde8900
  - /haberler/brezilya-da-meta-ya-devlet-baskani-adaylarina-esit-muameleyi-belgelemesi-icin-24-saat-sure--b4939ee2-a149-44b1-9690-d0b43dd2cda3

#### Critical Request Chains
> Identifies chains of dependent resources that delay rendering
_6 of 16 pages carried from previous crawls._
- [!] **critical-request-chains**: 2 critical request chain(s) found _(Not re-checked this run — last verified 2 days ago.)_
  (64 pages)
  - /almanya-maas-beklentisi (carried)
  - /almanya-yasam-tarzi-uyumu (carried)
  - /almanya-yolunu-sec (carried)
  - /almanyada-is-bulma-olasiligi (carried)
  - /almanyaya-hazir-misin (carried)
  - ... +59 more pages
- [!] **critical-request-chains**: 2 critical request chain(s) found (+33 more pages)
  (34 pages)
  - /
  - /almanya-araclari
  - /almanyada-yasam
  - /belgeler
  - /blog
  - ... +29 more pages

#### Lazy Loading Above Fold
> Detects lazy loading on likely above-fold images
- [!] **lazy-above-fold**: 1 above-fold image(s) with lazy loading (+15 more pages)
  (16 pages)
  - /
  - /haberler
  - /haberler/7-ilde-bahis-operasyonunda-22-tutuklama--d1a48869-91c3-4507-9915-496db5a6480a
  - /haberler/almanya-akaryakitta-gecici-vergi-indirimi-karari-aldi--2b9af277-5803-458b-a1f9-5a02abde8900
  - /haberler/brezilya-da-meta-ya-devlet-baskani-adaylarina-esit-muameleyi-belgelemesi-icin-24-saat-sure--b4939ee2-a149-44b1-9690-d0b43dd2cda3
  - ... +11 more pages

#### Unminified JavaScript
> Detects unminified JavaScript that could be optimized
_8 of 18 pages carried from previous crawls._
- [!] **unminified-js**: 1 JavaScript file(s) appear unminified (+15 more pages)
  (16 pages)
  - /
  - /belgeler
  - /haberler/7-ilde-bahis-operasyonunda-22-tutuklama--d1a48869-91c3-4507-9915-496db5a6480a
  - /haberler/almanya-akaryakitta-gecici-vergi-indirimi-karari-aldi--2b9af277-5803-458b-a1f9-5a02abde8900
  - /haberler/brezilya-da-meta-ya-devlet-baskani-adaylarina-esit-muameleyi-belgelemesi-icin-24-saat-sure--b4939ee2-a149-44b1-9690-d0b43dd2cda3
  - ... +11 more pages
- [!] **unminified-js**: 2 JavaScript file(s) appear unminified _(Not re-checked this run — last verified 2 days ago.)_
  (47 pages)
  - /almanya-maas-beklentisi (carried)
  - /almanya-yasam-tarzi-uyumu (carried)
  - /almanya-yolunu-sec (carried)
  - /almanyada-is-bulma-olasiligi (carried)
  - /almanyaya-hazir-misin (carried)
  - ... +42 more pages

#### Cache Headers
> Checks Cache-Control header configuration
_1 of 11 pages carried from previous crawls._
- [!] **cache-control**: Cache-Control without max-age _(Not re-checked this run — last verified 2 days ago.)_
  (19 pages)
  - /cerez-politikasi (carried)
  - ... +18 more pages
- [!] **cache-control**: Cache-Control without max-age (+16 more pages)
  (17 pages)
  - /almanya-araclari
  - /almanyada-yasam
  - /belgeler
  - /blog
  - /ekibimize-katil
  - ... +12 more pages

### Mobile

#### Web App Manifest
> Checks the web app manifest the pages link: that it loads and parses, its name, start_url and display, its 192px and 512px PNG icons, and that its theme_color matches the pages' theme-color
- [!] **web-app-manifest**: Web app manifest https://almanya101.de/manifest.webmanifest has 1 issue(s) (linked from https://almanya101.de/, https://almanya101.de/almanya-araclari, https://almanya101.de/almanyada-yasam, https://almanya101.de/belgeler, https://almanya101.de/blog and 29 more)
  (34 pages)
  - /
  - /almanya-araclari
  - /almanyada-yasam
  - /belgeler
  - /blog
  - ... +29 more pages

### E-E-A-T

#### About Page
> Checks for an about/company page with content
- [!] **about-page**: No About page found

#### Contact Page
> Checks for contact page with multiple contact methods
- [!] **contact-page**: No Contact page found

#### Privacy Policy
> Checks for privacy policy page linked from footer
- [!] **privacy-policy**: No Privacy Policy page found

#### Authority Signals
> AI assessment of per-page authority signals: authorship, citations, and outbound references
- [!] **authority-signals**: No author attribution or citations detected on this page _(Not re-checked this run — last verified 2 days ago.)_
  (45 pages)
  - /almanya-maas-beklentisi (carried)
  - /almanya-yasam-tarzi-uyumu (carried)
  - /almanya-yolunu-sec (carried)
  - /almanyada-is-bulma-olasiligi (carried)
  - /almanyaya-hazir-misin (carried)
  - ... +40 more pages


**3968** passed, **315** warnings, **41** failed

*Generated by [squirrelscan](https://squirrelscan.com)*