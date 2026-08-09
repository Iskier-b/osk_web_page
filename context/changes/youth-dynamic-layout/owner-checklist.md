# Owner checklist — youth-dynamic-layout (FR-010 / S-06)

Public review URL (redeploy after this change so the URL reflects the youth layout):  
https://osk-juszczak.bartosz-iskierka.workers.dev

## IA freeze

- [ ] `src/lib/site-nav.ts` labels, order, and hrefs unchanged vs pre-change
- [ ] Desktop primary nav labels match the frozen IA
- [ ] Mobile sheet exposes all Oferta and Strefa children

## Viewports

- [ ] **375px** — home: no horizontal scroll; brand + hero readable; nav sheet usable
- [ ] **375px** — ≥2 top-level pages (e.g. Kursy, Kontakt) share the youth shell
- [ ] **375px** — deep path `/prawo-jazdy-automat` consistent
- [ ] **375px** — ≥1 stub (e.g. `/regulamin`) shows “Treść w przygotowaniu” only
- [ ] **Desktop** — nav dropdowns + Zapisy CTA readable; layout consistent with mobile chrome

## Motion

- [ ] With motion allowed: hero entrance + scroll reveals present (2–3 purposeful moments)
- [ ] With OS/browser reduced motion: entrance/scroll animations do not run

## Forms / stubs

- [ ] Kontakt / Zapisy / Referencje / home EnrollmentStrip look on-system
- [ ] Submit remains disabled; demo notice still honest

## Public URL

- [ ] After `npx wrangler deploy` (if needed), the review URL loads the youth layout
