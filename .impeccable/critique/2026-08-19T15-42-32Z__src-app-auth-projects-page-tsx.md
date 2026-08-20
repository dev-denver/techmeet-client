---
target: 프로젝트 목록→상세 (src/app/(auth)/projects/page.tsx)
total_score: 29
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
timestamp: 2026-08-19T15-42-32Z
slug: src-app-auth-projects-page-tsx
---
Method: dual-agent. No browser automation available this session (stated once). Assessment B: 0 findings across 9 files, micro-typography suppression confirmed working.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Count line flickers on every search/filter refetch |
| 2 | Match System/Real World | 4 | Korean domain terms accurate |
| 3 | User Control and Freedom | 2 | Sheet backdrop tap closes with no confirm, discards note |
| 4 | Consistency and Standards | 3 | Filter pills lack aria-current unlike BottomNav |
| 5 | Error Prevention | 3 | Good validation, undercut by P0 |
| 6 | Recognition Rather Than Recall | 4 | Deadline/match info always visible |
| 7 | Flexibility and Efficiency | 2 | No match-sort/filter, inefficient for power users |
| 8 | Aesthetic and Minimalist Design | 3 | Detail page stacks 4 sections, no progressive disclosure |
| 9 | Error Recovery | 3 | getApplicationForProject swallows errors (P0) |
| 10 | Help and Documentation | 2 | No reassurance copy at commitment moment |
| **Total** | | **29/40** | **Good** |

## Design Specificity Verdict

LLM: matching badges/chips are product-specific; apply form and filters don't make the core matching differentiator actionable.
Deterministic scan: 0 findings, no false positives.

## Priority Issues

[P0] getApplicationForProject swallows real DB errors as "not applied"
src/lib/supabase/queries/applications.ts:97 - `if (error || !data) return null;`. Same bug class already fixed on home; mirror getProjectById (throw except PGRST116).
Suggested command: /impeccable harden

[P1] Apply sheet backdrop-tap discards up to 1000-char note with no confirmation
ApplyButton.tsx handleOpen() resets fields every open; bottom-sheet.tsx backdrop onClick closes unconditionally. CLAUDE.md's own ConfirmSheet pattern exists for exactly this and isn't applied.
Suggested command: /impeccable harden

[P1] Skill-matching logic is decorative only, not actionable
countSkillMatches/getMatchedSkillSet only power a badge; no match-based sort/filter despite PRODUCT.md naming matching quality as the success metric.
Suggested command: /impeccable optimize

[P2] Filter pills lack accessible active-state (aria-pressed)
ProjectFilters.tsx:29-40 - color-only active indication, inconsistent with BottomNavigation's aria-current pattern.
Suggested command: /impeccable harden

[P2] Expired-but-still-recruiting cards show contradictory "모집중" + "마감" badges simultaneously
ProjectCard.tsx:24-27.
Suggested command: /impeccable clarify

[P3] Count line and card list flicker on every fetch
ProjectListClient.tsx:147 - `{!isLoading && <p>...</p>}` unmounts/remounts every refetch.
Suggested command: /impeccable polish

## Persona Red Flags

Sam: ProjectCard is one giant role="link" div, screen reader reads the whole card as one run-on link; ApplyButton char counter has no aria-live.
Alex: no match-sort, "load more" pagination only, +N overflow chips not expandable in place.
Riley: backdrop-tap data loss is exactly the kind of bug a stress-tester finds in minutes.

## Minor Observations

- ShareButton silently vanishes if getProfile() returns null for any reason.
- Urgent-deadline chip opacity differs between hero (bg-status-danger/25) and card (bg-status-danger/10) - likely intentional contrast need, undocumented in DESIGN.md.
- formatProjectPeriod's partial-date fallback phrasing is inconsistent between start-only and end-only cases.
- Apply sheet header shows no project title, user loses visual context of what they're applying to mid-form.
- getApplications() (list API route) still has the pre-throw-discipline swallow pattern in one adjacent spot - broader queries/*.ts throw-discipline sweep recommended as follow-up.

## Questions to Consider

- If matching is the stated success metric, why can't a user act on it (sort/filter), only observe it after the fact?
- Is showing an expired-but-labeled-recruiting project consistent with the "closed/curated, nothing shown that can't be acted on" trust premise?
- Is a synchronous 1000-char freeform note the right friction for applying to an already-vetted project?
