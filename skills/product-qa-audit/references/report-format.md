# System Health & Optimization Report

Use this structure for every completed audit.

## 1. Executive Summary

Write 1-3 short paragraphs covering:
- what was audited
- whether the product is broadly usable
- the most important failures or friction points
- whether the run was blocked by auth, verification, test data, or environment issues

Then add a compact summary list:
- **Overall status:** Healthy / Usable with issues / At risk / Blocked
- **Coverage:** pages and flows actually tested
- **Bugs found:** count by severity if possible
- **Enhancements identified:** count
- **Artifacts saved:** report path and screenshot folder if any

## 2. Audit Scope

List:
- target product name and URL
- audit mode: manual quick smoke / manual full audit / cron full audit / focused module audit
- account state: registered new account / logged into existing account / anonymous only
- areas tested
- areas skipped or blocked
- notes on environment or test constraints

## 3. The Bug List (Must Fix)

Group by category when useful:
- Authentication & Account
- Navigation & Routing
- Forms & Validation
- Core Product Workflow
- Settings & Profile
- Performance / Reliability
- Visual / UI Integrity

For each bug, use this template:

### [Severity] Bug title
- **Area:**
- **Confidence:** Confirmed / Likely / Suspected
- **Summary:**
- **Steps to reproduce:**
  1. ...
  2. ...
  3. ...
- **Expected result:**
- **Actual result:**
- **Impact:**
- **Evidence:** screenshot path or `No screenshot captured`
- **Notes:** optional

If no bugs are found, explicitly write: `No must-fix defects were confirmed during this audit.`

## 4. The Enhancement List (Should Improve)

Capture issues that are not broken enough to classify as defects but still hurt usability, clarity, speed, trust, or retention.

For each item, use this template:

### Enhancement: short title
- **Area:**
- **Observed friction:**
- **Why it matters:**
- **Recommendation:**
- **Expected benefit:**
- **Evidence:** screenshot path or `No screenshot captured`

If no enhancements are worth mentioning, explicitly say so.

## 5. Strategic Recommendations

Provide the top 3 highest-leverage changes.

Each recommendation should include:
- the recommendation itself
- why it is high-impact
- whether it primarily improves conversion, retention, trust, speed, or support burden

Favor product-level leverage over tiny UI polish.

## 6. Appendix: Evidence & Notes

Include concise raw notes such as:
- pages visited
- flows completed
- console or network observations if available
- intermittent behavior
- blockers and assumptions
- saved artifact paths

Keep the appendix useful, not bloated.
