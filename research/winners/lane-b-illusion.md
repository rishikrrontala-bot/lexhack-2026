# Winner brief — Illusion (transparent AI audits of company privacy policies)

**Hackathon:** Great Agent Hack 2025 (Holistic AI x UCL Hackathon 2025), London (UCL East – Marshgate), 15–16 Nov 2025. Build window: tracks released 10:45 GMT on 15 Nov, submissions closed 15:00 GMT on 16 Nov (about 28 h). Entries were submitted on Devpost (https://hai-great-agent-hack-2025.devpost.com). The organizer's rules say it was open to "Students (undergraduate, graduate, PhD)", professionals and researchers aged 18+, in teams of 3–5. $65,000 prize pool, three tracks. · **Prize won:** **Track A ("Agent Iron Man": performance & robustness), 3rd Place: £1,750 + £350 Valyu + $350 AWS**, plus the **"Most Valyu Award"**.
**Submission URL:** organizer's winners list: https://github.com/holistic-ai/hackathon-2025/blob/main/winners/README.md. I found no Devpost project-page URL for Illusion. The event's Devpost is https://hai-great-agent-hack-2025.devpost.com · **Repo:** https://github.com/Stanleyhoo1/Illusion · **Demo video:** none. The event required a one-page poster, not a video. Illusion's poster, archived by the organizer at `posters/Illusion.png` and hosted on Devpost's CDN (https://d112y698adiu2z.cloudfront.net/photos/production/solution_photos/003/993/208/datas/original.png), is a screenshot of the results screen.
**Verified:** page loaded ☐ (Devpost is blocked by egress) · prize stated on page ☑ (the **organizer's own GitHub repo**, `holistic-ai/hackathon-2025`, loaded via `git clone`) · video played ☐ (no video exists)
**How verified:**
- Primary source 1, organizer: `holistic-ai/hackathon-2025/winners/README.md` (committed 2025-11-24) lists "**3rd Place**: Illusion — Prize: £1,750 + £350 Valyu + $350 AWS — Awards: Track A 3rd, Most Valyu Award — GitHub: https://github.com/Stanleyhoo1/Illusion". The same repo's `posters/README.md` independently says "**Illusion** (Track A - 3rd Place) … Risk ratings dashboard with transparency score showing privacy policy analysis". The two files agree on Illusion. **Caveat:** they disagree about other teams. For example, `posters/README.md` calls GenAiExplainer "Track B 1st Place, Grand Champion", while `winners/README.md` lists Jailbreak Lab as Grand Champion and GenAiExplainer as Track B 3rd. The organizer's list is therefore not fully clean, but Illusion's placement is consistent.
- Primary source 2, team repo: I cloned `Stanleyhoo1/Illusion` and read the README, the agent prompts and all 93 commits.
- Secondary: a WebSearch returned the repo and Holistic AI's blog posts on the event. Those summaries confirm the event and its sponsors (AWS, NVIDIA, Valyu, PGIM RealAssetX, MAPFRE) but do not mention Illusion's placement.

## Pitch, verbatim
> "Illusion is a multi-agent auditing system that makes **company privacy, data-collection, and data-usage policies transparent**." (repo README, first line)
>
> "Online privacy policies are long, scattered across obscure links, and written for lawyers—not users. This makes it hard for people to understand how their data is collected, shared, tracked, and retained." (repo README, Project Overview)

## The wow moment
You type one company name (e.g. "AWS"; a microphone input is also offered) and get back a **Transparency Score gauge (4/5 "Good")** plus three colour-coded risk tiles: **Data Collection 3/5 Medium, Data Sharing 2/5 Low, Tracking 3/5 Medium**. Below them sits a bullet summary of what the policy actually says, and a "Model Transparency" panel showing tokens, latency, the tools called and the agent's step-by-step reasoning. The poster shows exactly this screen, so the result screen itself was the pitch. No timestamp is possible because there is no video.

## Demo teardown
- Length: n/a. There was no video; judging used the poster, the GitHub repo and an in-person presentation.
- First 15 seconds show: n/a. The poster (the judges' first impression) is a single full-bleed screenshot: gauge, three risk tiles, then a summary list of AWS's data practices ("AWS explicitly states it does not sell customer personal information", GDPR/CCPA compliance and so on).
- Narrated? Captioned? Live or recorded?: live, in-person judging (the 16 Nov schedule has a judging period of 15:00–17:30 GMT).
- Real data or hardcoded?: **real, fetched live**. A search agent (Valyu search) finds the official privacy, terms and cookie pages, and an extract agent pulls the data-practice clauses. **The 1–5 ratings are, however, assigned by an LLM prompt** (`summary_agent.py`: "data_collection_risk: 1–5 … Explain WHY you assigned each rating. Refer EXPLICITLY to specific extracted_points and their source URLs"). There is no deterministic rubric behind the numbers.

## Scope reality
- Features actually shown working: company or URL search → policy discovery → clause extraction → structured JSON report with four scores, evidence-linked reasoning, "user protection advice" and sources. It also has per-stage error handling (the search, extract and summary stages each return partial results on failure), token and cost tracing (Strands + MLflow, and LangSmith was added), and result caching keyed by company.
- Features only described: nothing major. The README is unusually literal about what exists. It includes a "Track-Specific Requirements" section that maps each checklist item from the organizer's SUBMISSION_CHECKLIST (performance metrics, error handling, baseline comparison, execution traces, failure analysis) to a concrete field in the API response.
- Repo commit window: **93 commits, 2025-11-15 11:19 UTC → 2025-11-16 14:33 UTC**, entirely inside the event (the first commit came 34 minutes after track release, the last 27 minutes before the deadline). Commits came from 7 git identities for a team capped at 5, so some people probably used two identities. The whole product was built at the event.

## Stack
Python/FastAPI backend with three agents on **Strands Agents** + **Gemini** (`strands.models.gemini.GeminiModel`); **Valyu** search API (a sponsor, which is why it won "Most Valyu Award"); MLflow/LangSmith tracing; a cache DB. React + Vite + TypeScript + shadcn/ui frontend with glassmorphism components. Running it needs three secrets (GEMINI_API_KEY, VALYU_API_KEY, organizer team token), so a cold visitor cannot run it. The stack was partly the story: sponsor-tool use earned a side award.

## Submission page shape
Devpost page not viewable. The required artefacts were: one poster PDF/PNG, a GitHub URL, team, track and description. Illusion's poster led with **the product's output screen, not a diagram or a problem statement**. The README leads with a five-bullet "what it does", then architecture, API response shape, and a track-by-track compliance section.

## Why this won (one sentence)
A familiar digital-rights pain (unreadable privacy policies) became one query → one glanceable score screen with evidence links. The team also documented, field by field, how the build satisfied every item in the track's judging checklist (latency, cost, error handling, traces).

## Transferable to us
- **Copy:** make the result screen the hero. One input produces a scored, cited, glanceable verdict, and that screenshot works as a gallery image.
- **Copy:** mirror the rubric in the README. Illusion (Track A/B checklist) and ClauseWise (see lane-a-clausewise.md, "How This Scores") both put a section in the README that maps each judging criterion to evidence. We should add a "How this meets the LexHack rubric" table (Impact, Technical, UX, Innovation, Presentation) that links to live proof.
- **Copy:** show the machinery. Tokens, latency, tools called and reasoning steps were a visible panel, not hidden logs. For a legal tool, the equivalent is showing which statute section drove each output.
- **Do not copy:** LLM-assigned 1–5 risk scores are fake precision. A judge who asks "why 3 and not 4?" gets "the model said so". Ours must come from a deterministic, published rubric over real text, and the same input must always give the same score.
- **Do not copy:** needing three API keys to run. CLAUDE.md's rule stands: a cold judge visit must work with no key.
- **Lane note:** privacy-policy analysers are common on Devpost (search turned up "Privacy Policy Analyzer Chrome Extension", "Privacy Pilot", "Privacy Policy Tracker" and "Priv"). Illusion won on execution and rubric fit, not novelty. A LexHack digital-rights entry needs a sharper angle than "summarise a privacy policy".

**Sources:** https://github.com/holistic-ai/hackathon-2025 (winners/README.md, posters/README.md, docs/HACKATHON_RULES.md, docs/SUBMISSION_CHECKLIST.md; cloned 2026-09-24) · https://github.com/Stanleyhoo1/Illusion (cloned 2026-09-24) · https://hai-great-agent-hack-2025.devpost.com (search-index only) · https://www.holisticai.com/blog/what-we-learned-from-the-great-agent-hack-2025 (search-index only)
