---
target: 로그인/회원가입 (src/app/login/page.tsx)
total_score: 25
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 1
timestamp: 2026-08-19T16-28-06Z
slug: src-app-login-page-tsx
---
Method: dual-agent. No browser automation available (stated once). Assessment B: 4 findings - 3x text-[15px] (login button, login submit, signup submit), 1x #FEE500 Kakao yellow (false positive - CLAUDE.md sanctions this exception).

## Design Health Score

| # | Heuristic | Score |
|---|---|---|
| 1 | Visibility of System Status | 2 |
| 2 | Match System/Real World | 1 |
| 3 | User Control and Freedom | 2 |
| 4 | Consistency and Standards | 3 |
| 5 | Error Prevention | 3 |
| 6 | Recognition Rather Than Recall | 4 |
| 7 | Flexibility and Efficiency | 2 |
| 8 | Aesthetic and Minimalist Design | 4 |
| 9 | Error Recovery | 2 |
| 10 | Help and Documentation | 2 |
| **Total** | | **25/40** |

## Design Specificity Verdict

Kakao-first flow, exact brand color pairing, hairline-card structure, semantic-only password strength bar all read as authored for this system. But PRODUCT.md's stated two-segment user model (소속 vs 가입대기) has no counterpart in the code - AccountStatus is Active/Withdrawn only, signup sets Active unconditionally.

## Priority Issues

[P0, partial fix] No completion acknowledgment after signup; account-status model question flagged separately
signup sets account_status: Active unconditionally, router.replace("/") with no toast/welcome. Whether a pending-approval state should exist is a cross-repo product decision (shared DB with techmeet-admin) - out of scope to build unilaterally. The safe half (a completion acknowledgment) is fixable now.
Suggested command: /impeccable onboard

[P1] Silent 10-minute signup-session expiry causes total data loss
signup_email cookie maxAge:600; signup/page.tsx redirects to /login with no error code/warning as it nears expiry.
Suggested command: /impeccable harden

[P2] Signup form errors aren't wired for screen readers
FormField's error <p> has no id; Input never receives aria-invalid/aria-describedby. Same root-cause finding recurred in profile and settings critiques this session - now fixing at the source.
Suggested command: /impeccable harden

[P3] "전체 동의" bundles the optional SMS checkbox into required completeness
checked={agreeAge && agreeTerms && agreePrivacy && agreeSms} includes the explicitly optional SMS consent in the aggregate condition.
Suggested command: /impeccable clarify

## Persona Red Flags

Jordan (PRODUCT.md's 가입대기 persona): smooth Kakao flow, decent form, then dropped on home with zero acknowledgment - sharpest mismatch between stated intent and built experience.
Casey: interrupted mid-form, 10-min cookie expires, silently redirected to /login with all input lost.
Sam: no aria-describedby/aria-invalid on validation failure; birth date split into 3 controls instead of one semantic date field.

## Minor Observations

- Login submit has aria-busy, signup's equivalent doesn't - inconsistent within the same feature.
- Suspense fallback={null} on /login produces a blank flash instead of using the app's own skeleton language.
- Password inputs have no autoComplete attribute, suppressing password-manager prompts.
- Referrer field has no help text explaining what it's for.

## Questions to Consider

- Is Active-only account model an intentional pivot from PRODUCT.md's 가입대기 concept, or is approval gating happening invisibly admin-side? If the latter, should PRODUCT.md be corrected?
- Was 600s chosen against a measured completion time for this exact 7-field+2-legal-doc form, or copied from a shorter flow?
