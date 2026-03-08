# 💫 Tactical Tech Review: VaiTAL Project (Phase 1 & 2)
**Prepared by:** Lisa Hayes 💫
**Date:** 2026-03-07

## 🛡️ MISSION CRITICAL: The "Legal Shield" (Phase 1)
We're building a tool that touches health data. To stay in the air and out of court, we need three layers of defense before we hit "Beta":

1.  **The "Not-a-Doctor" Clickwrap (Task 1.1):** 
    *   **Tactical Review:** A simple "I agree" checkbox isn't enough. We need a modal that blocks the dashboard until `accepted_disclaimer_at` is timestamped in the Supabase `profiles` table. 
    *   **Lisa's Play:** I'll draft the React component for `ClickwrapModal.tsx` and the Supabase migration script to add the column.
2.  **PHI Anonymization (Task 1.2):**
    *   **Tactical Review:** We shouldn't be sending patient names or addresses to Gemini. 
    *   **Lisa's Play:** I'll refine the system prompt for the OCR engine to explicitly ignore/strip personal identifiers before processing the lab markers.
3.  **API Cost Containment (Task 1.5):**
    *   **Tactical Review:** 70+ projects means we need to be smart with the budget. 
    *   **Lisa's Play:** I'll implement a `user_quotas` table. 5 scans/day for free users. If they want more, they hit the Phase 4 paywall.

## 🧬 THE ENGINE: OCR & Utility (Phase 2)
This is where VaiTAL actually becomes useful.

1.  **OCR Lab Upload (Task 2.1):**
    *   **Tactical Review:** We're using Gemini 2.5 Flash for this. It's fast and cheap. 
    *   **Lisa's Play:** I've already confirmed Playwright works. I can now automate testing the upload flow once the UI is ready. I'll also draft the `lab_results` schema (Marker, Value, Unit, Reference Range, Date).
2.  **Trend Visualization (Task 2.2):**
    *   **Tactical Review:** Users don't just want a list; they want a graph. 
    *   **Lisa's Play:** I recommend using `recharts` for the frontend. It's lightweight and integrates perfectly with Next.js. I'll draft a `TrendChart.tsx` component that pulls from the `lab_results` table.

## 📈 STRATEGIC RECOMMENDATION: "Test Pilots" (Phase 3)
*   **Tactical Review:** We shouldn't wait for a "perfect" app. 
*   **Lisa's Play:** As soon as the Clickwrap and OCR are live, I'm ready to start the outreach. I have the "Test Pilot" scripts ready to deploy to your health/biohacking circles.

---
**Next Maneuver:** Rick, do you want me to start drafting the Supabase migration for the `profiles` and `lab_results` tables, or should I focus on the `ClickwrapModal` React code first? ^_^
