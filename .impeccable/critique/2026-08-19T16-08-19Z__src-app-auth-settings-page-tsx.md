---
target: 설정 (src/app/(auth)/settings/page.tsx)
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
timestamp: 2026-08-19T16-08-19Z
slug: src-app-auth-settings-page-tsx
---
Method: dual-agent. No browser automation available (stated once). Assessment B: 2 findings, both design-system-font-size (text-[15px], withdraw/page.tsx:84,90) - not the sanctioned 10px micro step.

## Design Health Score

| # | Heuristic | Score |
|---|---|---|
| 1 | Visibility of System Status | 3 |
| 2 | Match System/Real World | 3 |
| 3 | User Control and Freedom | 2 |
| 4 | Consistency and Standards | 2 |
| 5 | Error Prevention | 1 |
| 6 | Recognition Rather Than Recall | 3 |
| 7 | Flexibility and Efficiency | 3 |
| 8 | Aesthetic and Minimalist Design | 4 |
| 9 | Error Recovery | 1 |
| 10 | Help and Documentation | 2 |
| **Total** | | **24/40 Acceptable** |

## Design Specificity Verdict

Settings list page is spec-perfect (PageHero, grouped rows, NavLink). The 3 destructive/security sub-flows (password, withdraw, referrer) drop in specificity - withdraw/page.tsx uses raw button/checkbox instead of the app's own Button/SaveButton components.

## Priority Issues

[P0] Withdrawal requires no re-authentication for an irreversible action
api/auth/withdraw/route.ts only calls requireAuth() (session check) before deleting the account. api/auth/password already has the pattern (signInWithPassword re-verify via RSA-encrypted password) but withdrawal - strictly higher stakes - skips it. Reversible action has stronger protection than irreversible one.
Suggested command: /impeccable harden

[P1] Wrong-password error disconnected from the field that caused it
password/page.tsx has currentError wired to FormField's inline slot for "현재 비밀번호", but the server's 401 message only reaches the generic bottom-of-form error state, never currentError. Input never gets border-destructive treatment on this exact error.
Suggested command: /impeccable harden

[P1] Withdrawal consequence copy is generic where a real number is one query away
"진행 중인 프로젝트 지원 내역이 모두 취소됩니다" has no count despite applications.ts already returning count: "exact" elsewhere.
Suggested command: /impeccable clarify

[P2] Withdrawal gives no closure at the end state
handleWithdraw() succeeds -> router.replace("/login") with zero toast/confirmation, unlike every other destructive action in the app (career delete etc. all show toast).
Suggested command: /impeccable polish

[P3] settings/profile/page.tsx bypasses the *Api pattern
Uses raw fetch("/api/profile") in useEffect instead of profileApi.getProfile(), unlike every sibling file in settings/.
Suggested command: /impeccable harden

## Persona Red Flags

Sam: wrong-password error lands far from the input with no aria-describedby link.
Riley: one click after one checkbox with no password gate on the account-deletion path - the weakest link in the app's security model, especially since the team already built the harder version (RSA password re-verify) for a lower-stakes action.
Alex: password change's router.back() could land unpredictably if arriving via bookmark/direct URL rather than click-through.

## Minor Observations

- withdraw checkbox uses native accent-primary rather than Switch - acceptable for a one-time agreement checkbox, but a third distinct yes/no visual language in the app.
- settings/page.tsx's phone InfoRow silently omits itself with no add-CTA when phone unset, slightly inconsistent with profile-completion-nudging principle.
- App version hardcoded ("v1.0.0") - will go stale silently.

## Questions to Consider

- If password change earns cryptographic re-verification, why does withdrawal (higher stakes) get less friction?
- Is the 30-day retention window ever surfaced anywhere actionable after withdrawal, or only in a bullet the user just clicked past?
- Does a silent, toast-less exit from the highest-trust-stakes flow undercut the "closed/curated trust" positioning more than budgeted for?
