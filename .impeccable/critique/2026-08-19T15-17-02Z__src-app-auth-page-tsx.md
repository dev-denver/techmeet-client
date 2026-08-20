---
target: 홈 (src/app/(auth)/page.tsx)
total_score: 23
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
timestamp: 2026-08-19T15-17-02Z
slug: src-app-auth-page-tsx
---
Method: dual-agent (A: general-purpose design-review sub-agent · B: general-purpose detector-evidence sub-agent)
No browser automation available this session — both assessments proceeded without live screenshots.

## Design Health Score (Nielsen 10 heuristics)

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 1 | Failed fetches render identically to genuinely-empty state |
| 2 | Match System / Real World | 3 | Stat numbers sit outside their own section header |
| 3 | User Control and Freedom | 2 | NavLink is a div, breaks ctrl/cmd-click new-tab on desktop |
| 4 | Consistency and Standards | 4 | Excellent — status.ts centralization, uniform NavLink/chip styling |
| 5 | Error Prevention | 3 | Inline two-step cancel confirm on ApplicationCard is good |
| 6 | Recognition Rather Than Recall | 3 | Pending vs Withdrawn chips nearly indistinguishable (both neutral) |
| 7 | Flexibility and Efficiency | 1 | No sort/filter/swipe, single linear path for all users |
| 8 | Aesthetic and Minimalist Design | 4 | DESIGN.md's achromatic restraint well executed |
| 9 | Error Recovery | 1 | Same root cause as #1 — nothing visible to recover from |
| 10 | Help and Documentation | 1 | Zero onboarding/profile-completion nudge on highest-traffic screen |
| **Total** | | **23/40** | **Acceptable** |

## Design Specificity Verdict

LLM: copy/data level is product-specific (availability status, funnel stats, skill matching); IA structure is a stock mobile dashboard template. Core differentiator (curated/vetted platform) stated in PRODUCT.md is invisible in the actual rendered pixels.

Deterministic scan: detect.mjs across 10 files -> 4 findings (2 real, 2 advisory), 2 of 59 rules fired.
- side-tab (warning x2) on ApplicationCard.tsx:176,187 (border-l-4) — likely FALSE POSITIVE; conflicts with LLM's assessment that this is a deliberate, restrained status-coding pattern aligned with DESIGN.md.
- design-system-font-size (advisory x2) on page.tsx:175, stats-grid.tsx:43 (text-[10px], not in DESIGN.md's 4-step type ramp) — confirmed real; LLM independently flagged the same 10px labels as a Casey-persona legibility risk. Convergent signal.

## Overall Impression

Visual restraint (DESIGN.md's intent) is well executed, but that restraint also swallows error visibility and onboarding. Biggest opportunity: distinguish real errors from empty states, and surface profile-completion nudging on home (PRODUCT.md's own stated top priority).

## What's Working

1. Dark hero vs flat white content creates hierarchy without touching font size — successful Two-Weight Rule execution.
2. ApplicationCard's border-l-4 status accent — quiet, glanceable status coding via a thin left bar instead of a saturated badge; best execution of DESIGN.md's "color only through status tokens" rule (detector mis-flagged this as slop).
3. Inline two-step cancel confirm avoids a jarring full BottomSheet for a low-stakes destructive action.

## Priority Issues

[P0] Errors are indistinguishable from "zero data"
Why it matters: getApplications/getProjects/getNotices swallow errors internally and return empty-array success; a user with real applications sees "no applications" during a transient DB blip.
Fix: render a distinguishable degraded state per section ("불러오지 못했습니다 · 다시 시도") when the settled promise is rejected, extending CLAUDE.md's client-side loadError pattern to server components.
Suggested command: /impeccable harden

[P1] Profile-completion nudge missing from home
Why it matters: PRODUCT.md names this the highest-priority UX investment, but ProfileCompletionBar only renders inside /profile, which a fresh user has no reason to visit.
Fix: reuse the existing ProfileCompletionBar/profile-completion.ts to surface a compact prompt on home when completion is low.
Suggested command: /impeccable onboard

[P1] Auth-failure fallback copy is misleading
Why it matters: "로그인 후 이용해주세요" fires on any falsy profile, including fetch errors for an already-authenticated user (the (auth) group is middleware-gated) — sends confused users down a dead-end re-login path.
Fix: separate "not authenticated" copy from "failed to load profile data" copy.
Suggested command: /impeccable clarify

[P2] Horizontal-scroll rails have no discoverability affordance
Why it matters: scrollbar-none hides the native scrollbar with no replacement signal; card widths can exceed the 600px frame's usable width with no swipe cue.
Fix: force a partial-card peek at the right edge or add an edge fade mask (no dots/arrows — would violate the flat design intent).
Suggested command: /impeccable clarify

[P3] Curated-platform trust signal absent from the primary landing surface
Why it matters: the closed/vetted positioning is the stated core differentiator vs. open marketplaces, but the "모집 중인 프로젝트" section reads structurally identical to any open job board.
Fix: copy-only — add a one-line subhead under the section title.
Suggested command: /impeccable distill

## Persona Red Flags

Casey (distracted mobile): 10px stat labels under bold large numerals risk misreading at a glance; "내 신청 현황" rail caps at 3 with only a text link hinting more exist.
Jordan (first-timer / 가입대기): first home view is four zero-stats and two empty-state boxes, with no signal that completing their profile improves matching odds.
Alex (power user): NavLink is a div, so ctrl/cmd-click can't open project cards in new tabs for comparison — conflicts with the product's stated equal-desktop-experience principle.

## Minor Observations

- Hero label text (text-primary-foreground/50) contrasts ~4.8:1 — passes AA but with thin margin.
- StatsGrid has no aria-label tying each value to its label as a unit.
- ApplicationCard's compact variant omitting note/expectedRate looks like intentional density tiering, not an issue.

## Questions to Consider

- If curated trust is the platform's reason to exist, why does the first screen every session opens on say nothing about it?
- Was showing an identical empty-state for "error" and "genuinely empty" ever a deliberate decision, or an accident of markup reuse?
