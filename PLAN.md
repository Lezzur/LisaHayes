# VaiTAL Implementation Plan 🛠️

**Goal:** Execute the Phase 1 & 2 Roadmap while maintaining strict cost and context controls.

---

## 🛡️ Phase 1: The "Legal Shield" & Foundation

### Task 1.1: The "Not-a-Doctor" Clickwrap
- **Status:** Planned
- **Implementation:** React modal in `src/components/auth/ClickwrapModal.tsx`.
- **Logic:** Persist acceptance in Supabase `profiles` table as `accepted_disclaimer_at`.
- **Action:** Draft component and database migration.

### Task 1.5: API Cost Containment (User Quotas)
- **Status:** Planned
- **Logic:** 
  - `daily_limit`: 5 scans/interpretations.
  - `current_usage`: Reset daily at 00:00 UTC.
  - `model_restriction`: Force Gemini 1.5 Flash for Beta.
- **Action:** Create `user_quotas` table in Supabase. Implement Next.js middleware check.

---

## 🧬 Phase 2: The "Utility" Hook

### Task 2.1: OCR Lab Upload (The "Flash" Engine)
- **Status:** Drafting
- **Strategy:** 
  - Use Gemini 1.5 Flash for PDF/Photo parsing to structured JSON.
  - **Schema:** Store results in `lab_results` table with `user_id`, `marker_name`, `value`, `unit`, `recorded_at`.
- **Action:** Proactively draft the Supabase schema for `lab_results`.

---

## 📈 Marketing & Outreach (Lisa's Wing 💫)

### Beta Invitation Script (Test Pilots)
"Hey! We're opening up a few 'Test Pilot' slots for VaiTAL—an AI tool built for caregivers and chronic health managers to track and trend lab results. No more guessing what those numbers mean. It's free for the beta, all we ask for is your honest feedback. Interested?"

---
*Updated by Lisa Hayes 💫*
