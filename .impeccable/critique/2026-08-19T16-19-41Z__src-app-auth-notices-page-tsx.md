---
target: 공지사항/알림 이력 (src/app/(auth)/notices/page.tsx)
total_score: 16
max_score: 32
na_heuristics: 5,10
p0_count: 1
p1_count: 2
timestamp: 2026-08-19T16-19-41Z
slug: src-app-auth-notices-page-tsx
---
Method: dual-agent. No browser automation available (stated once). Assessment B: 0 findings.

## Design Health Score

| # | Heuristic | Score |
|---|---|---|
| 1 | Visibility of System Status | 3 |
| 2 | Match System/Real World | 2 |
| 3 | User Control and Freedom | 2 |
| 4 | Consistency and Standards | 3 |
| 5 | Error Prevention | n/a (no destructive/input actions) |
| 6 | Recognition Rather Than Recall | 1 |
| 7 | Flexibility and Efficiency | n/a (notice detail read-mode) / 1 (log) |
| 8 | Aesthetic and Minimalist Design | 3 |
| 9 | Error Recovery | 1 |
| 10 | Help and Documentation | n/a |
| **Total** | | **16/32 Acceptable-ish (2 heuristics n/a)** |

## Design Specificity Verdict

NoticeListClient and notification log cards are domain-built. notices/[id]'s prev/next/list footer is a stock Korean bulletin-board pattern, contradicting DESIGN.md's explicit "not a board" positioning. Notifications screen's Bell icon entry point + "받은 알림이 없습니다" copy borrow live-inbox vocabulary for what's actually a delivery log.

## Priority Issues

[P0] Notification type is undecodable - label field is dead code
SERVICE_TYPE_CONFIG defines {label, icon} but only the icon renders (notifications/page.tsx). Every card communicates type via icon alone, no text, no aria-label.
Suggested command: /impeccable clarify

[P1] Fetch failure silently identical to "no history"
getAlimtalkLogs().catch(() => ({data:[],total:0})) in notifications/page.tsx coalesces real errors into the same empty state, contradicting CLAUDE.md's own loadError pattern.
Suggested command: /impeccable harden

[P1] Log shows only metadata, never message content; non-Project entries have no destination link
href is only set for Project-type (hardcoded to generic /projects, not the specific project); Notice/Individual entries are fully inert divs.
Suggested command: /impeccable clarify

[P2] Bell icon + board-style detail footer send the wrong mental model
TopBar's bare Bell (no unread state) for a log, not inbox; notices/[id] uses classic 이전/다음/목록 board navigation, contradicting DESIGN.md's explicit "not a board" positioning.
Suggested command: /impeccable distill

[P3] Micro-typography weight omitted; list importance marker has no text/SR alternative
StatusBadge spans use text-[10px] but never font-medium (DESIGN.md's micro step is 10px/500weight); NoticeListClient's Bell importance icon has no aria-label.
Suggested command: /impeccable typeset

## Persona Red Flags

Jordan: taps Bell expecting application-status alerts, lands on a delivery log with icon-only entries, has to independently discover /projects/applications.
Sam: type icon has no text alternative at all (screen reader gets templateName + date + status only); list importance Bell icon has no aria-label, so she must open every notice to find the flagged one.
Alex: no unread marker or since-last-visit delta - power user gets no incremental value from repeat visits, will likely learn to ignore the screen entirely.

## Minor Observations

- Notice attachment links use both download and target="_blank" - browsers often ignore download when target=_blank is also set for cross-origin URLs.
- notices/[id] fetches all notices unpaginated just to compute prev/next - scale concern as table grows.
- getNotices()'s pageSize ?? 20 fallback is never exercised by either caller.

## Questions to Consider

- What actually produces "개별" (individual) log entries today, and why do they get identical icon+date+badge treatment as a generic project broadcast if they're the only trace of an application-status message?
- If a 발송 실패 entry means a project alimtalk never reached someone, is /notifications the only trace, discoverable only if the user proactively checks?
- Why does the one detail page in this pair reach for the single most recognizable legacy-board affordance instead of the app's own card/pill vocabulary?
