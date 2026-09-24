# Research brief: LexHack 2026

*Written Wed Sep 23, 2026, ~10:50 PM ET, 90 h before the deadline.*

## Method, and its limits (read first)
This cloud session's egress policy blocks `devpost.com`, `*.devpost.com`, `law.stanford.edu`, `kingselab.org`, `hackthelaw-cambridge.com`, `apartresearch.com`, YouTube, Wikipedia, archive.org and every U.S. government statute site. So no winner's Devpost or organizer page could be **loaded**, and no demo video could be **played**.
Instead, each winner was verified two ways:
1. Several differently worded WebSearch queries whose results returned the organizer's own URL and stated the prize. A fact went in only when it appeared consistently.
2. Wherever a public repo existed, it was **cloned and read** (README, commit history, and in two cases the code was run).

Each brief's "How verified" line says exactly which of these happened. No winner was cited from memory. LexHack 2026 is a **first edition** (the similarly named `lexhack.devpost.com` / `lexhack-26.devpost.com` are Lexington High School's unrelated in-person events), so there are no prior-edition winners. Per the skill's fallback order, the research went to same-domain winners (AI × law, access to justice, AI governance) from the last ~24 months.

## The eight winner briefs
| Brief | Event | Prize (as verified) | What it was |
|---|---|---|---|
| [ClauseWise](winners/lane-a-clausewise.md) | Stanford CodeX LLM x Law Hackathon #6, Apr 2026 | Listed on CodeX's winners post (tier unconfirmed) | Contracts compiled into executable state machines; deterministic decompiler back to English |
| [Precedent AI](winners/lane-a-precedent-ai.md) | King's E-Lab LLM x Law Hackathon, Cambridge, Jun 2024 | **First Prize** | Asylum legal-aid research memo tool ("13 h → 30 min", team-claimed) |
| [Nasir.AI](winners/lane-a-nasir-ai.md) | same event | **2nd Prize** + CodeX category prize | Contract obligations → generated pandas code run on delivery records → Green/Red/"could not determine" |
| [HackNCheese](winners/lane-a-hackncheese.md) | The Justice Hack 2025, Vancouver | **Champion's Award** | Employment-agreement analyzer with plain-language output and a hand-off to lawyers |
| [CounterClaim Eagle](winners/lane-b-counterclaim-eagle.md) | LLM x Law Hackathon 2025, Cambridge (students only) | **1st, Hacker Track (£10,000)** + CodeX × Jus Mundi | **Solo** entrant; arbitration co-counsel with a Monte-Carlo outcome simulator; numbers computed in code |
| [Illusion](winners/lane-b-illusion.md) | Great Agent Hack 2025 (Holistic AI × UCL, Devpost) | **3rd, Track A** + Most Valyu Award | Company → privacy-policy transparency score, cited evidence, visible agent trace |
| [SycophantSee](winners/lane-b-sycophantsee.md) | Apart Research AI Manipulation Hackathon, Jan 2026 | Winner (placement conflicting) | Contrast demo: same claim, different framing → 7× the sycophancy activation |
| [Lobo](winners/lane-b-lobo.md) | HooHacks 2026 (UVA, Devpost) | Best AI Safety & Alignment Evaluations (self-reported, 3 agreeing sources) | Live sliders steering model activations; visible behavior change |

The LexHack 2026 field itself is mapped in [`COMPETITION.md`](COMPETITION.md): 11 entries found, each repo cloned and read.

## Problem shape that keeps winning
**Institutional friction in the legal system, made concrete for one named user, with a machine doing the tedious exact part.** Precedent AI (asylum lawyers' research), Nasir.AI (contract compliance checks), HackNCheese (workers reading employment contracts), CounterClaim Eagle (arbitration counsel). None of them is a general "legal chatbot". Each picks one document type, one workflow and one person.

## Demo shape that keeps winning
- **One mechanism, visibly working on real material,** plus a **contrast** a judge can see (SycophantSee's framing flip, Lobo's sliders, Nasir.AI's Green/Red verdicts).
- **Evidence beside every verdict:** citations, the generated code, the agent trace (Illusion, Nasir.AI, ClauseWise).
- **An honest "can't determine" state** (Nasir.AI's "Could not determine"; ClauseWise lists 14 rules it couldn't map and why).
- **Deterministic core, AI at the edges:** ClauseWise and CounterClaim Eagle compute every number in code and use the model only to read text. The weakest winners are weak exactly where an LLM invented a number (Illusion's 1–5 risk scores, Lobo's typed-in baselines).

## Scope ceiling
One-day to 48-hour events. Winners got **one feature working end to end** plus the evidence around it (ClauseWise: compile → run → decompile, 11 commits; Nasir.AI: 18 commits in ~10 h, with hardcoded dashboard rows and an unbuilt "notify" feature). LexHack is a longer, virtual window, and [`COMPETITION.md`](COMPETITION.md) shows the field using it: benchmarks, live demos and 2–3 min videos are table stakes here.

## What winners consistently skipped
- **Demo videos:** none of the eight had a findable video. Most were judged in person, which LexHack is not. At a virtual event the video *is* the pitch, and at least 4 LexHack competitors already have one. Ours must be the best one.
- Breadth: multiple jurisdictions, multiple document types, settings screens, accounts.
- Measured accuracy: the only numbers in these briefs are team claims or LLM outputs. **A reproducible benchmark against real ground truth would put us ahead of every winner surveyed.**

## Judges and rubric
- LexHack 2026 publishes no judge list in anything the search index returns. The organizer isn't named either: the sponsor bundle (CodeCrafters / Adaption Labs / DevSwarm / .xyz / YouCam) is a common perk package across many student-run Devpost events (lane-B report), so it doesn't identify one host.
- The rubric is published, and it is the spec: **Real-World Impact & Feasibility 25%** ("addresses a genuine challenge … a realistic, practical approach that could actually be deployed or used by real people"), **Technical Execution & Functionality 25%**, **UX & Design 20%**, **Innovation & Originality 15%**, **Presentation & Documentation 15%**.
- Official themes: *legal guidance, plain-language translation, public assistance platforms*; *AI safety, bias detection, governance auditors*; *automated contract parsers and legal workflow agents*. Projects "can be web apps, mobile apps, low-code prototypes, browser extensions, or custom algorithms." The organizers also promise follow-on support (mentorship, deployment, access to civic partners and legal clinics) for high-potential teams, which rewards *deployability*.

## What this means for our entry (implemented in `CONCEPT.md`)
1. **Aim at a gap in the field, not the crowded lanes.** Nobody touches legislation. Legal Automation & Workflow Innovation is the least contested track.
2. **Deterministic core with measured accuracy against real ground truth** (the Council codifiers' own machine-readable edits), and an honest "needs a human" state.
3. **Evidence beside every change:** each strike or insert traces to the sentence of the bill that made it.
4. **A contrast demo:** the bill's unreadable instruction versus the readable law it produces, and the replayed law versus the Council's published text.
5. **A README table mapping each rubric criterion to evidence** (a pattern two surveyed winners used).
6. **The demo video is first-class**, because at a virtual event it is the primary artifact and the surveyed winners never had one.
7. **Solo is fine:** CounterClaim Eagle won £10k as a solo student entrant.
