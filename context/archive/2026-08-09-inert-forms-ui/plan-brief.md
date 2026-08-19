# Inert forms UI — Plan Brief

> Full plan: `context/changes/inert-forms-ui/plan.md`

## What & Why

Ship FR-006: ready-looking forms that never send data, with submit clearly disabled and an explicit demo-only notice — so the owner sees conversion UI without trusting a fake live backend.

## Starting Point

Kontakt has prose (S-04) but no form. Zapisy and Referencje are stubs. Home uses a CTA to Zapisy, not a form. F-01 documented four form surfaces; no marketing form kit exists yet.

## Desired End State

All four surfaces show inert forms: compact home strip, full Zapisy enrollment, Kontakt after prose, minimal Opinie page. Shared demo notice + disabled submit; no POST, no captcha, no invented backends.

## Key Decisions Made

| Decision       | Choice                                       | Why (1 sentence)                                        |
| -------------- | -------------------------------------------- | ------------------------------------------------------- |
| Surfaces       | All four (home, Zapisy, Kontakt, Referencje) | Matches F-01 recommendation for full FR-006 coverage    |
| Home UX        | Compact strip (name + phone) → full Zapisy   | Signals enrollment without restoring a heavy hero form  |
| Demo messaging | Shared notice + disabled submit              | Explicit trust signal without page-level alert noise    |
| Captcha        | Omit                                         | Avoids dead third-party widgets and false “verify” cues |
| Zapisy body    | Form-only                                    | Fastest enrollment page without inventing copy          |
| Referencje     | Title + optional harvested lead + form       | Enough chrome for the form; no invented Opinie body     |
| Term select    | Single disabled “niedostępne w demo” option  | Honest empty demo vs stale dated CMS options            |
| Kontakt label  | Fix to **Wiadomość**                         | Light clarity; same meaning as source                   |

## Scope

**In scope:**

- Shared Astro form kit + demo notice
- Four inert surfaces wired into existing layouts
- Manual FR-006 no-send verification stamp in Notes

**Out of scope:**

- Live POST / email / CRM / reCAPTCHA / maps
- Login or payment forms
- Invented Zapisy/Opinie marketing copy
- Auth component reuse

## Architecture / Approach

Astro-native components under `src/components/forms/`: shared notice + enrollment (full + strip) + contact + opinion. Append/replace on existing prerendered routes; Broad tokens; inert submit contract (disabled + `onsubmit` cancel; no POST action).

## Phases at a Glance

| Phase                    | What it delivers         | Key risk                                    |
| ------------------------ | ------------------------ | ------------------------------------------- |
| 1. Shared inert form kit | Reusable forms + notice  | Inert contract gaps (Enter still navigates) |
| 2. Home strip + Zapisy   | Enrollment surfaces live | Strip overcrowds home hierarchy             |
| 3. Kontakt + Referencje  | Contact + opinion forms  | Inventing Referencje lead if harvest empty  |
| 4. Polish & verify       | FR-006 acceptance stamp  | Missed surface or inconsistent notice       |

**Prerequisites:** S-02 done; Kontakt prose available (S-04 path filled or equivalent)
**Estimated effort:** ~2 sessions across 4 phases

## Open Risks & Assumptions

- Compact home strip may need spacing tweaks vs Hero/DashboardStrip density
- Referencje may ship title+form only if source has no harvestable lead
- Parallel S-03 publish may show forms before polish finishes — acceptable under capacity bias

## Success Criteria (Summary)

- Four surfaces show ready UI with shared demo notice and disabled submit
- No form attempt sends data (click or Enter)
- Lint/build green; mobile and desktop forms usable without horizontal overflow
