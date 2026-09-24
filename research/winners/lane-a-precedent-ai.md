# Winner brief — Precedent AI

**Hackathon:** Inaugural LLM x Law Hackathon, hosted by King's Entrepreneurship Lab with Stanford CodeX, King's College, Cambridge (UK), 22–23 Jun 2024 (same event as Nasir.AI) · **Prize won:** **First Prize**
**Submission URL:** https://www.kingselab.org/blog/hackathon2024 (organizer results post) and https://www.kingselab.org/blog/hackathon-precedent-ai (organizer feature, "Law and Large Language Models, A Glimpse of the Future"); no Devpost · **Repo:** none found · **Demo video:** none found
**Verified:** page loaded ☐ · prize stated on page ☐ · video played ☐
**How verified:**
- kingselab.org is blocked by egress (WebFetch returned EGRESS_BLOCKED). I ran six differently worded WebSearch queries that surfaced the organizer's own pages. Three summaries state the prize explicitly: "Precedent AI won first prize", "The project won first place", and "First Prize: Precedent AI" (the last from `blog/hackathon2024`). All six describe the tool the same way: legal-aid work for immigration and asylum lawyers covering case review, precedent research and memo drafting. Five of the six repeat the "13-hour → under 30 minutes / 26×" figure.
- GitHub searches for a repo ("precedent ai legal aid hackathon cambridge", "asylum precedent memo hackathon") returned 0 results. The team members' names did not appear in any snippet I saw.
- **Everything below is second-hand, from search-index renderings of organizer pages. No primary artifact (repo, video, screenshots) was available.** Treat this brief as a record of the pitch and the judging signal, not as a build teardown.

## Pitch, verbatim
> "This groundbreaking tool transforms a 13-hour research workflow into a sub-30-minute process, making lawyers 26 times more efficient. By leveraging large language models, vector databases, and recently published explainability techniques, Precedent AI offers lightning-fast case reviews, pinpoint-accurate legal precedent searches, and automated memo drafting."

(The quote is the search-index rendering of `kingselab.org/blog/hackathon-precedent-ai`. The wording was consistent across queries but was not read on a loaded page.) The organizer's results post frames it as enhancing "the efficiency of legal aid work by streamlining case review, research, and memo drafting". It also claims social impact "especially in the field of immigration and asylum legal aid, leading to improved access to justice, better quality of legal services, and a decrease in burnouts among lawyers."

## The wow moment
A before/after the judges could hold in their heads: a 13-hour asylum-case research and memo workflow reduced to under 30 minutes (13 h = 780 min; 780 / 30 = 26×, so the "26 times" is internally consistent). **The source does not say how that number was measured.** It is the team's or organizer's claim, and I could not verify it. No video was found, so no timestamp.

## Demo teardown
- Length: not determinable.
- First 15 seconds show: not determinable.
- Narrated? Captioned? Live or recorded? Not determinable (in-person event; no recording found).
- Real data or hardcoded? Not determinable.

## Scope reality
- Features actually shown working: not determinable from available sources.
- Features only described: case review; precedent search over "extensive legal databases" with "pertinent precedents and citations"; automated memo drafting of "evidence-based advice"; "recently published explainability techniques" (which techniques is not stated).
- Repo commit window: no repo found.

## Stack
As described: "large language models, vector databases, and recently published explainability techniques". The specific model, vector store, corpus and front end are not determinable. One search summary of the organizer's pages says participants had access to "over 150 language models including Gemini" and a large legal-tech data repository. That summary mixed figures across editions, so it is unconfirmed for 2024. Whether this team used event-provided data is not determinable.

## Submission page shape
- Images: not determinable.
- Sections present: not determinable (no Devpost; the organizer feature post is a narrative write-up).
- Led with: judging by the organizer's feature post, the time-saving headline ("13-hour research workflow into a sub-30-minute process").

## Why this won (one sentence)
It took a sympathetic, under-resourced access-to-justice user (overworked immigration and asylum legal-aid lawyers), named the exact workflow it replaces (review → precedent research → memo), and gave judges one memorable before/after number.

## Transferable to us
- **Copy:** anchor the pitch on one named, under-served user and one concrete workflow, then show the before/after. In an AI × Law × Civic Tech event, a legal-aid or self-represented user scores directly on "Real-World Impact & Feasibility" (25%).
- **Copy:** citations and explainability as a headline feature, not a footnote. For a legal tool, showing the source of every statement is the credibility mechanism (and our "never claim to give legal advice" rule needs it anyway).
- **Adapt, don't copy:** the "26× faster" claim. Our CLAUDE.md forbids unreproducible metrics. If we use a time-saved figure, it must come from a scripted, documented measurement in the repo (for example "steps to answer X: 14 manual vs 3 in-app, method in docs/"). Otherwise we show the workflow difference visually and make no number claim.
- **Caution:** we can't see how much of this was actually built. In-room judging at this event may have rewarded pitch strength over a working product. On a virtual Devpost event, judges only see the video, the page and the repo, so the story needs a working demo behind it.
