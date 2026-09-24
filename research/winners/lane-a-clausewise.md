# Winner brief — ClauseWise

**Hackathon:** LLM x Law Hackathon #6, Stanford CodeX (FutureLaw Week), Stanford Law School, 12 Apr 2026 (one-day build) · **Prize won:** Listed as a winner on CodeX's post "2026 LLM x Law Hackathon #6 Winners" (27 Apr 2026). **Prize tier not confirmed:** two of eight search-index summaries of that post called it the overall / "1st Place" winner, and the other six only said "one of the winning projects". Do not call it "1st place" anywhere unless someone loads the page and sees that wording. The repo shows it was built against the sponsor brief **"Sharpe Hackathon Track: Executable Contracts"**.
**Submission URL:** https://law.stanford.edu/2026/04/27/2026-llm-x-law-hackathon-6-winners/ (organizer winners post; no Devpost for this event) · **Repo:** https://github.com/yuvrajy/clausewise (see attribution note below) · **Demo video:** none found
**Verified:** page loaded ☐ · prize stated on page ☐ · video played ☐
**How verified:**
- law.stanford.edu is blocked by this container's egress proxy (WebFetch returned EGRESS_BLOCKED). I confirmed the win through eight differently worded WebSearch queries. Every one returned the organizer URL above and described ClauseWise as a winning project. Several named its 5-person team (Alex Moon, Armin Heydari, Danhong Cao, Harit Patel, Yuvraj Taneja, "High School Student and AI Builder"), and one named Raj Abhyanker as mentor. The search summaries disagree on the tier, as noted above.
- Primary source: I cloned `github.com/yuvrajy/clausewise` and read the README, all 11 commits and the code. I ran the deterministic decompiler twice on the committed `fsm.json`. Both outputs were byte-identical (878 lines) and matched the committed `english.txt` except for one trailing newline. I also compiled the committed WesTex FSM to Python and ran its scenario offline with no API key: it printed a 10-step execution log.
- **Attribution note:** the organizer page could not be loaded, so I could not see the link the team submitted. I attribute this repo to ClauseWise from three facts: its name is `clausewise`; it was created 13 Apr 2026 03:25 UTC, the night of the event; and it implements the two components the CodeX summary names, a "Logic Runner" that simulates facts and "a deterministic decompiler (non-LLM)". The owner handle `yuvrajy` matches team member Yuvraj Taneja, but that is an inference.

## Pitch, verbatim
> "ClauseWise is a logic-based middleware designed to bridge the gap between static legal text and active financial systems. It transforms contracts from passive documents into executable code, allowing for automated enforcement and 'what-if' scenario modeling."

(The quote is as rendered by search-index summaries of the CodeX winners post. It is consistent across queries but was not read on a loaded page.) The repo README opens verbatim: "Contracts as finite state machines — extracted by LLM, executed deterministically, decompiled to English."

Target user and value proposition, per the CodeX summary: "Corporate Legal and FinTech departments managing high-volume, complex agreements (SLA credits, procurement, debt)", shifting legal teams "from reactive 'document reviewers' to proactive 'logic managers.'"

## The wow moment
The pipeline takes a real 2006 satellite-payload procurement contract (ORBCOMM–Orbital) and runs dated scenarios through it. It prints exact money outcomes: the committed `scenarios.txt` shows HAPPY_PATH paying `$204,000.00` on-time incentive and LATE_DELIVERY charging `$85,000.00` against Orbital. The run then decompiles the machine form back to English **without an LLM**, and the result is identical every time. Their own "trap" contracts (for example, a force-majeure clause that suspends late penalties but deliberately does *not* extend the early-delivery bonus) show it catching structural subtleties that a naive extraction would miss. No video was found, so no timestamp.

## Demo teardown
- Length: not determinable (no video found; CodeX page not loadable).
- First 15 seconds show: not determinable.
- Narrated? Captioned? Live or recorded? Not determinable. The sponsor brief required a "Base demo: runnable and checkable in fewer than 10 steps", so judges were expected to run it. The repo ships pre-computed outputs so the results can be inspected without an API key, plus a single-file browser visualizer (`contract-fsm/visualizer.html`, "Load Any Contract": paste `fsm.json` and `execution_result.json` into textareas to render the state graph).
- Real data or hardcoded? Real contract text: public commercial contracts supplied by the track (ORBCOMM procurement amendment, WesTex VISA card agreement, Galleria office lease, and others), plus four adversarial contracts the team wrote. The outputs are genuine pipeline runs (step-by-step checkpoints `step1_rules.json`…`step6_english.txt` are committed). **One caution:** the README's "How This Scores" table cites a "`$510,000` late penalty". That figure does not appear anywhere in the committed outputs, whose late-delivery scenario shows $85,000. The `$204,000` and `$680,000` figures do appear.

## Scope reality
- Features actually shown working (verified by me where marked ✔):
  - Two-pass LLM extraction of rules (Claude via `anthropic` SDK), typed with a Hohfeldian taxonomy (obligation, prohibition, permission, power, …). Output committed.
  - LLM FSM assembler, plus a pure-Python validator (reachability, dead ends, formula syntax) that feeds errors back to the assembler for a retry.
  - Pure-Python executor that runs dated event scenarios and computes money ✔ (compiled WesTex FSM ran offline: 10 transitions, late penalty, cure, grace restored).
  - Deterministic, LLM-free decompiler to English ✔ (two runs byte-identical; `decompiler.py`, `executor.py` and `validator.py` import no LLM SDK).
  - FSM → standalone Python module compiler ✔.
  - ORBCOMM run: 26 mappable rules and 14 **unmappable rules flagged with reasons** (from committed `report.txt`), "not silently dropped".
- Features only described: "Use the FSM to ground an LLM" (a README paragraph, no code). Generality on the organizers' held-out contracts is claimed and cannot be checked. Business days, time zones, deep cross-reference chains and amendment layering are explicitly listed as limitations.
- Repo commit window: the track author ("ayshptk") committed the challenge brief and sample contracts between 01:14 and 03:03 PDT on 12 Apr 2026. The team then pushed **2 commits at 20:26 and 20:29 PDT on 12 Apr** (48 files, about +17,800 lines, mostly generated JSON outputs). The work was all done on event day, but the history is squashed and the commits are authored as "Your Name <your.email@example.com>".

## Stack
Python 3.10+. The Anthropic SDK (Claude) is used for extraction, assembly and scenario generation only. The validator, executor, decompiler and compiler use the standard library only ("No other dependencies"). The visualizer is a single-file React/SVG HTML page. The stack **was** part of the story: the README's headline design choice is a "Strict LLM boundary. Validation, execution, and decompilation are deterministic by design, not convention". It cites four papers (FSM-SCG, IJCAI 2025, "36.9% → 95.3%"; Stipula; FlowFSM; Catala) as the basis for the architecture.

## Submission page shape
- Images: not determinable (CodeX page blocked). The repo has no images.
- Sections present (repo README, which judges ran): Quickstart → **"How This Scores" table mapping each of the track's 5 weighted criteria to concrete evidence in the repo** → ASCII architecture diagram marking which steps use an LLM → Trap Contracts table → Design Choices → Limitations → Project Structure → Requirements → References.
- Led with: a one-line thesis and then copy-paste commands, with pre-computed output flagged "no API key needed to inspect".

## Why this won (one sentence)
It met the sponsor's hardest requirement (deterministic, LLM-free English round-trip) as a verifiable property rather than a claim. It showed real stateful dollar computation on real contracts, stated its limits honestly (14 unmappable rules flagged), and handed judges a rubric-to-evidence table so scoring took no effort.

## Transferable to us
- **Copy:** a README section that maps LexHack's rubric one row per criterion (Impact 25 / Technical 25 / UX 20 / Innovation 15 / Presentation 15) to evidence a judge can click or run. This is the single most reusable pattern here.
- **Copy:** a hard, documented **LLM boundary**. The legal logic stays deterministic and testable, and a model is used only where language understanding is needed. This fits our static-first, no-key rule and gives Vitest something real to assert (for example "same input → identical output").
- **Copy:** adversarial "trap" fixtures that encode the known failure modes of legal text, used as unit tests and shown in the demo.
- **Copy:** "unmappable, flagged with a reason" output. This is documented restraint that judges can see (it belongs in LIMITATIONS.md and in the UI).
- **Copy:** pre-computed or sample outputs so a cold judge visit shows results without a key.
- **Don't copy:** README figures that can't be reproduced from the repo (the "$510,000"); squashed, anonymously authored commits; no demo video and no hosted demo. LexHack judges score UX (20%) and Presentation (15%), which this entry relied on in-room judging to cover.
- Note: this team was B2B (corporate legal / fintech) and had a practising lawyer and a PhD on it. Our solo student entry should borrow the rigor, not the audience.
