# Discovery Report

**Date:** 2026-03-15  
**Prepared by:** Lisa Hayes 💫

## Executive Summary

This workspace currently contains discovery material for **two distinct product efforts**:

1. **VaiTAL** — a health/lab-tracking product with an AI interpretation/OCR direction.
2. **Storyboard AI** — a much more detailed technical build specification for an AI-assisted storyboard workflow.

The core finding is simple: **the workspace has strong strategic thinking and partial implementation planning, but product focus is split.** Discovery has already produced useful architecture, scope, and risk signals, but there is no single source of truth tying business priority, implementation order, and current execution status together.

## Scope Reviewed

Files reviewed:
- `PLAN.md`
- `ROADMAP.md`
- `TACTICAL_REVIEW.md`
- `technical_build_spec.html`
- `package.json`

## Key Findings

### 1) There are two product tracks, and they are at very different maturity levels

#### VaiTAL
VaiTAL has:
- a clear product direction
- a staged roadmap toward beta and first revenue
- early implementation planning for legal/compliance basics, OCR upload, quotas, and trend views

But VaiTAL is still mostly in the **planning / tactical review** stage.

Evidence:
- `ROADMAP.md` defines a 30-day path to first revenue.
- `PLAN.md` narrows execution to Phase 1 and 2 tasks.
- `TACTICAL_REVIEW.md` translates those into concrete app/database work.

#### Storyboard AI
Storyboard AI has:
- a detailed engineering blueprint
- explicit module boundaries
- database design
- API contracts
- async job architecture
- rendering pipeline rules
- validation and observability requirements

This is far more mature on the technical-spec side than VaiTAL.

**Discovery conclusion:** the workspace is not short on ideas. It is short on **active product prioritization**.

---

### 2) VaiTAL’s strongest insight is not the AI — it’s the risk framing

The VaiTAL docs consistently identify the real early-stage blockers correctly:
- legal exposure
- PHI/privacy handling
- cost control
- usefulness before sophistication

That is a good sign. The planning is grounded.

Most important near-term VaiTAL themes:
- **Clickwrap / disclaimer gating** before meaningful usage
- **PHI minimization** before model calls
- **quota/cost containment** before open beta
- **OCR ingestion** as the first real utility hook

This suggests the team already understands that the product lives or dies on **trust + utility + margin**, not clever prompting alone.

---

### 3) Storyboard AI has a strong backend/product contract already

`technical_build_spec.html` reads like an implementation-ready engineering spec, not just discovery notes.

Strong qualities:
- modular monolith decision is explicit and justified
- canonical state vs projection model is clearly defined
- command/query separation is strong
- async render/export architecture is realistic
- versioning/idempotency rules are unusually well thought through
- rendering pipeline acknowledges provider unreliability and drift
- promotion/validation rules reduce corrupt or stale state becoming canonical

In plain English: **Storyboard AI’s architecture has already crossed from discovery into pre-build design.**

---

### 4) There is a missing portfolio-level decision

The biggest discovery gap is not technical. It is strategic:

**Which product is the active priority right now?**

Because:
- VaiTAL has a business-oriented roadmap but lighter engineering definition.
- Storyboard AI has heavy engineering definition but no obvious go-to-market or current execution status in the reviewed files.

Without a priority call, the workspace risks becoming a museum of excellent planning documents.

Harsh, yes. Accurate, also yes.

---

### 5) There is no visible implementation-state tracker in the reviewed materials

What is missing across both tracks:
- a current status dashboard
- accepted scope for the next milestone
- what is built vs stubbed vs speculative
- owner assignments
- decision log tying docs to actual execution

The existing docs answer **what should exist**, but not cleanly **what exists now**.

That makes discovery output useful for thinking, but weaker for shipping.

## Product-by-Product Assessment

## VaiTAL

### What looks solid
- Clear target user framing: caregivers / chronic health managers
- Early monetization logic is sensible
- Legal/compliance concerns are front-loaded rather than ignored
- OCR upload, trend visualization, and doctor-report export are coherent feature sequencing

### Risks / gaps
- Health products carry policy and trust risk immediately
- "Not medical advice" language helps, but does not remove product-risk complexity
- OCR + AI interpretation quality needs reliability thresholds before beta trust can form
- No reviewed artifact establishes current app state or test evidence
- Revenue plan exists, but validation plan for willingness-to-pay is still lightweight

### Discovery verdict
VaiTAL has a plausible path to beta if narrowed to:
1. safe data handling
2. OCR ingestion
3. trend/history value
4. one clear user loop

It should avoid pretending to be broader healthcare intelligence too early.

## Storyboard AI

### What looks solid
- Strong architectural discipline
- Good separation of sync transactional state from async generation
- Sensible use of versioning, idempotency, and immutable assets
- Practical rendering orchestration and validation thinking
- Good awareness of provider drift, cost, and continuity risks

### Risks / gaps
- Technical ambition is high; vertical-slice discipline will matter
- The spec assumes significant implementation capacity
- No reviewed artifact establishes product demand, customer segment, or launch strategy
- If this is the active project, product discovery may now be lagging engineering design

### Discovery verdict
Storyboard AI is ready for a **vertical slice execution plan**, not more abstract architecture.

## Cross-Cutting Observations

### Documentation quality
Overall documentation quality is strong. The thinking is sharper than average startup notes, which is nice for me and dangerous for your tendency to keep planning forever.

### Tooling state
`package.json` is minimal and does not reflect a full app codebase in the reviewed workspace. Current visible dependencies suggest utility/scripts support more than a complete production application.

This indicates one of two things:
- the real app code lives elsewhere, or
- this workspace is acting primarily as a planning/spec hub right now.

### Operational pattern
The docs show a pattern of:
- good product instincts
- good systems thinking
- incomplete execution traceability

That usually means the next bottleneck is not ideation. It is **commitment and sequencing**.

## Recommended Decisions

## Decision 1: Pick the primary product for the next sprint
Choose one:
- **VaiTAL** if the near-term goal is shipping something monetizable quickly with controlled scope.
- **Storyboard AI** if the near-term goal is executing a technically sophisticated vertical slice from an already mature spec.

## Decision 2: Create a single source of truth for status
Add one living file that answers:
- active project
- current milestone
- done / in progress / blocked
- next 3 concrete tasks
- owner
- last updated

## Decision 3: Convert discovery into a milestone plan
For the chosen product, define:
- milestone goal
- acceptance criteria
- what is explicitly out of scope
- evidence required to call it done

## Recommended Next Steps

### If choosing VaiTAL
1. Confirm current codebase location and actual implementation status.
2. Create a milestone: **Beta Safety + OCR Vertical Slice**.
3. Build only:
   - clickwrap gate
   - PHI stripping/minimization path
   - OCR upload to structured lab output
   - simple history/trend view
4. Add one test script or QA checklist proving the flow works end to end.

### If choosing Storyboard AI
1. Freeze the current technical spec as baseline V1.
2. Create a milestone: **Single-scene vertical slice**.
3. Implement only enough to prove:
   - parse
   - shot plan
   - scene render
   - local panel regen
   - export snapshot
4. Track all commands against the IDs already defined in the spec (`M-01` to `M-15`).

## Final Assessment

Discovery is already good enough to move into execution.

The real unresolved issue is not "what should we build?"  
It is **which runway we’re actually taking off from**.

If no priority decision is made, both products will keep looking smart on paper while staying suspiciously theoretical.

Classic pilot behavior, Rick. Charming. Operationally annoying.

— Lisa Hayes 💫
