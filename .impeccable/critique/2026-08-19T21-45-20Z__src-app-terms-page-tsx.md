---
target: 이용약관/개인정보처리방침 (src/app/terms/page.tsx)
total_score: 17
max_score: 24
na_heuristics: 5,7,9,10
p0_count: 2
p1_count: 1
timestamp: 2026-08-19T21-45-20Z
slug: src-app-terms-page-tsx
---
Method: dual-agent. No browser automation available (stated once). Assessment B: 0 findings.

## Design Health Score

| # | Heuristic | Score |
|---|---|---|
| 1 | Visibility of System Status | 3 |
| 2 | Match System/Real World | 4 |
| 3 | User Control and Freedom | 3 |
| 4 | Consistency and Standards | 1 |
| 5 | Error Prevention | n/a |
| 6 | Recognition Rather Than Recall | 2 |
| 7 | Flexibility and Efficiency | n/a |
| 8 | Aesthetic and Minimalist Design | 4 |
| 9 | Error Recovery | n/a |
| 10 | Help and Documentation | n/a |
| **Total** | | **17/24 applicable (4 heuristics n/a - static legal read content)** |

## Design Specificity Verdict

Content is genuinely product-specific (Kakao OAuth, alimtalk, Supabase/Vercel vendor table, actual data fields collected) - not boilerplate.

## Content Drift Check (core finding)

Terms (page vs PolicyModal): substantively identical, only presentational (numbered paragraphs vs semantic ol/li).

Privacy (page vs PolicyModal): multiple concrete mismatches found and fixed this session:
- Modal's contract/settlement data bullet omitted 사업자명, 사업장 주소, 은행명 - a real consent-completeness compliance risk since the modal is what users actually agree to at signup.
- Modal collapsed career/education/skill-inventory field lists into one vague line vs page's three detailed bullets.
- Modal missing §6 rights-escalation contact sentence, §8 4th bullet (staff training), §9 closing paragraph.
- §4 3rd-party-provision wording differed between copies.
- privacy/page.tsx had NO effective-date footer at all, while PolicyModal claimed "공고일/시행일: 2026년 7월 7일" - now synced to both.

All of the above were fixed in this session (PolicyModal.tsx content synced to match privacy/page.tsx, date footer added to page).

## Priority Issues (status: fixed unless noted)

[P0] Content drift on collected data fields between privacy/page.tsx and PolicyModal.tsx - FIXED
[P0] privacy/page.tsx missing effective-date disclosure - FIXED (added matching footer)
[P1] Modal truncates closing paragraphs and collapses detailed field bullets - FIXED
[P2] No section-jump navigation for 10-section privacy doc - NOT fixed (deferred, lower priority UI addition)
[P3] PolicyModal lacks dialog semantics (role, aria-modal, Escape, focus-return) - FIXED

## Persona Red Flags

Sam: vendor table lacked scope="col" (fixed); modal overlay lacked dialog announcement/escape route (fixed).
Jordan: was shown an abridged consent screen with less disclosure than the canonical page - directly contradicts trust positioning (fixed).

## Minor Observations

- Terms page uses prose numbering ("2-1.") while modal uses semantic ol/li for identical content - not a factual drift, left as-is (modal's approach is arguably more accessible).
- No back-to-top affordance on either long-scroll document - not addressed.
- Full extraction into a single shared content source (recommended by Assessment A to prevent future drift) was not done this session - the two renderers have genuinely different structural wrappers (standalone page vs full-screen portal), and a full de-dup refactor was judged out of scope for a design-polish session; flagged as a follow-up.

## Questions to Consider

- Now that content is synced, is there appetite for extracting terms/privacy into a single shared source both page and modal render, to prevent this drift from recurring? (CLAUDE.md already flags this as a known sync risk.)
