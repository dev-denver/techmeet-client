---
target: 내 정보 프로필 관리 (src/app/(auth)/profile/page.tsx)
total_score: 25
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
timestamp: 2026-08-19T15-53-21Z
slug: src-app-auth-profile-page-tsx
---
Method: dual-agent. No browser automation available (stated once). Assessment B: 3 advisory findings, all `design-system-font-size` for text-[11px] (BasicInfoTab.tsx:145, AvailabilityEditSheet.tsx:109, ResumeTab.tsx:104) - distinct from the sanctioned 10px micro step.

## Design Health Score

| # | Heuristic | Score |
|---|---|---|
| 1 | Visibility of System Status | 3 |
| 2 | Match System/Real World | 4 |
| 3 | User Control and Freedom | 1 |
| 4 | Consistency and Standards | 2 |
| 5 | Error Prevention | 1 |
| 6 | Recognition Rather Than Recall | 3 |
| 7 | Flexibility and Efficiency | 2 |
| 8 | Aesthetic and Minimalist Design | 4 |
| 9 | Error Recovery | 2 |
| 10 | Help and Documentation | 3 |
| **Total** | | **25/40 Acceptable** |

## Design Specificity Verdict

Genuinely domain-grounded (Korean SI staffing paperwork vocabulary, Daum postcode widget, business-registration branching) - not generic CRUD tabs. Deterministic scan found only minor typography-ramp drift, no false positives.

## Priority Issues

[P0] Silent unsaved-edit loss on tab switch
ProfileTabsClient.selectTab() unconditionally resets editingBasic on every tab click; CareerSectionClient's inline add/edit form is not a modal, fully unmounts when switching tabs. Undermines the product's own stated highest-priority screen.
Suggested command: /impeccable harden

[P0] Resume and contract-document delete have zero confirmation
ResumeTab.handleDelete / ContractDocumentField.handleDelete call delete API directly on click - no ConfirmSheet, no window.confirm, nothing. Stricter violation than CLAUDE.md's own banned window.confirm pattern. Inconsistent with EducationTab/SkillTab which correctly use ConfirmSheet.
Suggested command: /impeccable harden

[P1] Three incompatible tech-tag input widgets on one screen
TechStackInput (shared component) vs SkillTab's own TagInput vs CareerForm's comma-separated plain text field - CareerForm bypasses the documented shared component, degrading tech-stack data quality that matching depends on.
Suggested command: /impeccable distill

[P1] Profile tab strip lacks ARIA tabs semantics
No role="tablist"/role="tab"/aria-selected/role="tabpanel" - primary nav of the screen reads as 5 undifferentiated buttons to screen readers.
Suggested command: /impeccable harden

[P2] No client-side pre-flight file validation before upload
Neither ResumeTab nor ContractDocumentField checks file.size/file.type before calling the upload API; no MAX_FILE_SIZE constant exists despite CLAUDE.md documenting a 10MB cap.
Suggested command: /impeccable harden

## Persona Red Flags

Casey: exact target of the tab-switch data-loss bug; also most likely to fat-finger the resume trash icon (same size as download, zero confirm).
Sam: missing ARIA tabs semantics means screen reader announces 5 undifferentiated buttons, not a tab interface.
Alex: complex-profile power user hits both the tab-switch bug and personally notices the tag-input inconsistency fastest.

## Minor Observations

- ResumeTab/ContractDocumentField bypass the documented useSubmit+*Api+toast pattern entirely - no success toast, unlike every other mutation on this screen.
- TechStackInput's add/remove buttons lack focus-visible ring styling, unlike nearly every other interactive element in the codebase.
- CareerSection.tsx (non-client version) appears to be dead code - only CareerSectionClient is wired in.
- KakaoAddressInput swallows script-load failure via .catch(console.error) with no UI error/retry.
- EducationTab's two independent BottomSheets (eduForm.open, certOpen) have no mutual-exclusion guard.

## Questions to Consider

- If profile quality drives matching quality, why does this screen have the weakest data-loss/destructive-action protection in the app?
- Was CareerForm's plain-text tech input a conscious tradeoff, or does nobody notice because nobody fills all 5 tabs in one sitting?
- Is equal-weighting completion across 5 tabs the right signal, or should some fields matter more for matching than others?
