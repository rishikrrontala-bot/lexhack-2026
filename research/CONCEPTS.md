# Concepts: three candidates scored against the LexHack 2026 rubric

Rubric weights are from the event page (Real-World Impact & Feasibility 25, Technical Execution & Functionality 25, User Experience & Design 20, Innovation & Originality 15, Presentation & Documentation 15). Each concept is scored 1–5 per criterion.
Inputs: the field map in [`COMPETITION.md`](COMPETITION.md), the winner patterns in [`RESEARCH-BRIEF.md`](RESEARCH-BRIEF.md), and a feasibility spike on the data each concept needs (run in this session, notes below).

Hard constraints on every concept (CLAUDE.md + HACKATHON.md): static-first with no required key or backend; one explicitly scoped jurisdiction with every provision linked; visible "not legal advice" boundaries; never fabricate data or outputs; no overlap with Rishik's past projects (LeaseLeak, SAKSI, …) or sibling entries (none had claimed a concept when `scripts/siblings.sh` ran on Sep 23).

---

## A · In Its Place: *paste a D.C. bill, read the law it would make*

**Pitch.** Every D.C. bill is written as edit instructions ("Paragraph (2) is amended by striking the phrase 'X' and inserting the phrase 'Y' in its place"), so nobody reading one can see the law it produces. In Its Place compiles those instructions, applies them to the official D.C. Code, and shows the resulting law as a redline, with every change traced to the sentence of the bill that caused it. It also flags instructions that can't apply cleanly.

**Why it's real.** The U.S. House requires "comparative prints" showing how a bill changes existing law (the *Ramseyer rule*, House Rule XIII cl. 3(e)). It spent years building a Comparative Print Suite for this (launched Oct 2022), and that tool sits behind the House firewall for staff only ([POPVOX Foundation](https://www.popvox.org/legislative-technology/comparative-print-suite); [CRS R46790](https://www.congress.gov/crs-product/R46790)). D.C. residents reading a bill before a Council hearing have nothing like it.

**Data (verified in this session).** The Council publishes D.C.'s law as open XML on GitHub:
- [`DCCouncil/law-xml`](https://github.com/DCCouncil/law-xml): every law, including the English amending text **and** the codifiers' hand-written machine-readable edit for it (`codify:find-replace`, `insert`, `replace`, `repeal`, `redesignate-para`). There are **11,638 gold edit operations** in Council Periods 23–26 alone.
- [`DCCouncil/law-xml-codified`](https://github.com/DCCouncil/law-xml-codified): **389 linear point-in-time snapshots** of the whole D.C. Code (Oct 2021 → Sep 16, 2026), so every enacted law has a real before and after.

So the tool can be **measured against the Council's own codifiers**: parse the English, compare to the gold edit, apply it to the "before" snapshot, compare to the published "after".

**Wow moment.** A real bill on the left, the Code section on the right. One click, and the law rewrites itself in place: struck words fade under a rule, inserted phrases ink in, and hovering any sentence of the bill lights up exactly what it changed. Then "Replay D.C. Law 25-108 → ✓ identical to the Council's published text."

**Riskiest unknown.** Coverage of nested "is amended as follows:" structures and the path resolution (§ → (a) → (1) → (A) → (i)). The spike found about 90% of text edits in one regular "strike … insert … in its place" family, which is encouraging.
**Cut first if short.** (1) Paste-any-bill across all 55 titles, limited to a curated set of titles instead. (2) The drafting-linter breadth. The replay benchmark is the proof and stays.

| Criterion (weight) | Score | Why |
|---|---|---|
| Real-World Impact & Feasibility (25) | 4 | A named, documented need (Congress built this for itself), real users (residents testifying, advocates, journalists, Council drafters), deployable today as a static site on the Council's own open data. Beneficiaries are one step removed from "person in crisis", which costs a point. |
| Technical Execution (25) | 5 | A semantic parser + executable edit engine + word-level diff + linter, scored against 11k+ gold operations and 389 real code snapshots. Deterministic, reproducible, no key. |
| UX & Design (20) | 4 | The redline is one of the most legible visual idioms in law, and the animation is the demo. Risk: amendatory language is dense, so the UI must do the explaining. |
| Innovation & Originality (15) | 5 | No entry in the field touches legislation ([COMPETITION.md](COMPETITION.md)). An open, public comparative-print engine with a measured accuracy is new, and it's the first thing like it for D.C. |
| Presentation & Documentation (15) | 4 | The before/after makes an instantly readable video, and the benchmark gives quotable, reproducible numbers. The concept needs ~10 seconds of setup ("bills are diffs"). |
| **Weighted total** | **4.40** | |

---

## B · Faithful: *catch when an AI summary of the law changes its meaning*

**Pitch.** People increasingly read law through AI summaries. Faithful extracts the legal "atoms" of a D.C. Code provision (who, must/may/shall-not, conditions, exceptions, amounts, deadlines) and of a plain-language summary, aligns them, and highlights what the summary dropped, flipped or invented.

**Wow moment.** A summary that reads fine, and Faithful shows it silently turned "may" into "must" and dropped "unless the tenant gives 30 days' written notice."
**Riskiest unknown.** Faithfulness has no gold dataset here. And this session has **no LLM access** (no key, no n8n), so real AI summaries can't be produced to test against. Any demo summaries would be hand-written, which is exactly the "hardcoded demo" failure judges spot.
**Cut first.** Multi-provision summaries.

| Criterion (weight) | Score | Why |
|---|---|---|
| Real-World Impact & Feasibility (25) | 3 | Real concern, but the user and the moment of use are fuzzy. Who pastes a summary into a checker? |
| Technical Execution (25) | 3 | Heuristic atom extraction; no ground truth to measure against in this environment. |
| UX & Design (20) | 4 | Side-by-side alignment is visual and legible. |
| Innovation & Originality (15) | 3 | Reads as another hallucination checker in a field that already has two (Citation Auditor, CiteProof) plus Hack_the_Law's Hallucin8. |
| Presentation & Documentation (15) | 4 | Easy to explain in one sentence. |
| **Weighted total** | **3.35** | |

---

## C · Clean Slate D.C.: *when can my record be sealed?*

**Pitch.** A deterministic eligibility and timeline engine for D.C.'s record-sealing law (D.C. Code § 16-801 et seq., as amended by the Second Chance Amendment Act of 2022). Enter each arrest or conviction, and see the date each becomes eligible for sealing, with every rule linked to its clause.

**Wow moment.** A personal timeline where each record's sealing date lands, with the statute sentence that set it.
**Riskiest unknown.** The statute is long and full of carve-outs and effective-date staggers. Getting it wrong has real harm (someone doesn't file, or files and is denied), and there's no lawyer in the loop to validate. Similar tools already exist (Code for America's Clear My Record lineage).
**Cut first.** Automatic-sealing branches.

| Criterion (weight) | Score | Why |
|---|---|---|
| Real-World Impact & Feasibility (25) | 5 | Direct, life-changing stakes for a specific population. |
| Technical Execution (25) | 3 | A rule engine is solid but well-trodden, and correctness can't be verified against ground truth here. |
| UX & Design (20) | 4 | The timeline is a strong visual. |
| Innovation & Originality (15) | 2 | Established category; lands in the most crowded track (Access to Justice). |
| Presentation & Documentation (15) | 4 | Emotional, clear story. |
| **Weighted total** | **3.70** | |

---

## Scores

| | Impact 25 | Tech 25 | UX 20 | Innov 15 | Pres 15 | **Total** |
|---|---|---|---|---|---|---|
| **A · In Its Place** | 4 | 5 | 4 | 5 | 4 | **4.40** |
| C · Clean Slate D.C. | 5 | 3 | 4 | 2 | 4 | 3.70 |
| B · Faithful | 3 | 3 | 4 | 3 | 4 | 3.35 |

## The pick: A · In Its Place

It leads on the two criteria this field is weakest at: originality (nobody else touches legislation) and a *measured* technical claim against real ground truth. It also sits in the least contested track, **Legal Automation & Workflow Innovation**. It is fully static, runs on the Council's own open data (reachable even from this locked-down session), and gives the video a visual idiom anyone can read: a law being redlined.

**Pre-mortem: "it's judging day and we lost, why?"**
1. *Judges didn't get what a bill-as-diff is.* The first 10 seconds must show the problem: a sentence of a real bill that is unreadable on its own, then the law it produces. The landing page is the tool, pre-loaded.
2. *It looked like a developer tool.* It needs editorial, document-grade typography, and the people using it (a resident preparing testimony) must be named on screen.
3. *"Where's the AI?"* Answer it head-on: this is automated law, a legal-language parser measured against the codifiers. An LLM would be the wrong tool for a step that must be exact, so we don't use one, and the benchmark shows why that choice holds up.
4. *It broke on a pasted bill.* Honest abstention: any instruction the engine can't parse or apply is shown as "needs a human" with the reason, never guessed.
