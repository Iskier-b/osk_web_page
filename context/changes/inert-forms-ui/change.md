---
change_id: inert-forms-ui
title: Inert forms ui
status: implemented
created: 2026-08-09
updated: 2026-08-09
archived_at: null
---

## Notes

### 2026-08-09 — FR-006 consistency / inert contract (Phase 4)

- All four surfaces (`/`, `/zapisy-na-kurs`, `/kontakt`, `/referencje`) wire `DemoFormNotice` plus a disabled submit via shared form components.
- Inert contract is present in form markup: `onsubmit="return false;"`, `disabled` submit controls, no POST `action` / `method` on any marketing form.
- Shared notice string is one line (`Wersja demonstracyjna — wysyłanie formularza jest wyłączone.`); submit styling uses Broad tokens (`submitClass`); no purple/glass auth classes. Term select remains a single disabled demo option on full enrollment only.
- Consistency pass found no drift requiring code changes.
- Browser DevTools / visual walk (Enter/click → no network; ~375px + desktop) remains on the human Manual checklist — Manual rows not claimed done here.
