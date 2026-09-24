# Winner brief — HackNCheese (employment-agreement analyzer)

**Hackathon:** The Justice Hack 2025, "Employment & Workplace Rights" edition, hosted at McCarthy Tétrault, Vancouver, B.C., 25–26 Oct 2025. It bills itself as "B.C.'s largest access-to-justice hackathon": a 24-hour sprint, 60+ participants, and "10 teams built 9 prototypes in 24 hours". · **Prize won:** **Champion's Award**, the event's top award, described as recognising "the team whose solution best demonstrated scope, impact, innovation, usability, and technical execution, effectively creating the greatest positive change for those navigating everyday legal problems".
**Submission URL:** https://thejusticehack.org/special-thanks-awards-vancouver-hackathon-2025/ (organizer awards page; no Devpost) · **Repo:** none found · **Demo video:** none found for this project. The organizer runs a YouTube channel (https://www.youtube.com/@thejusticehack7840), which is blocked here, so I could not check it.
**Verified:** page loaded ☐ · prize stated on page ☐ · video played ☐
**How verified:**
- thejusticehack.org is blocked by egress (WebFetch returned EGRESS_BLOCKED). Six differently worded WebSearch queries returned **two independent sources** that agree on the award. The first is the organizer's awards page above. The second is the Canadian Bar Association B.C. Branch magazine, *BarTalk*: "Interdisciplinary Innovation at the Justice Hack", 9 Jan 2026, https://bartalk.org/article/perspectives/justice-in-every-corner/interdisciplinary-innovation-at-the-justice-hack. Both say "Emily Martin and Andrew Munro-West received the Champion's Award for their employment-agreement analyzer…". The event format (dates, 24 h, team size 3–5) came from the organizer and Eventbrite snippets.
- **Discrepancies, stated plainly:** the team/project name "HackNCheese" appeared in three search summaries of the organizer's pages but is **not** in the BarTalk quote. One summary rendered the second member as "Adam Munroe-West"; the two direct quotes say "Andrew Munro-West".
- GitHub search ("justice hack employment agreement") returned 0 results. No primary build artifact was available.

## Pitch, verbatim
> "An AI-powered employment agreement analyzer that helps workers understand their contracts, get plain-language summaries, and connect with lawyers—reducing costs and making legal review more accessible."

(The quote is the search-index rendering of the organizer's awards page and was not read on a loaded page.) BarTalk's wording: "their employment-agreement analyzer that combined AI and legal expertise to translate contracts into plain language and help connect workers with lawyers." Another organizer snippet: it "pairs AI with lawyer insight to unpack contracts in plain language."

## The wow moment
Not determinable from available sources (no video or screenshots). By the description, the arc is: a worker drops in their own employment agreement, gets a plain-language explanation of what they signed, and is handed to a real lawyer. The organizer's recap names this "first mile" (intake + navigation) as the event's common theme: getting people "help faster, in plain language" so advocates "spend time on real problem-solving".

## Demo teardown
- Length: not determinable.
- First 15 seconds show: not determinable.
- Narrated? Captioned? Live or recorded? Not determinable (in-person pitch to judges at the end of a 24 h sprint).
- Real data or hardcoded? Not determinable.

## Scope reality
- Features actually shown working: not determinable.
- Features only described: contract upload and analysis; plain-language summaries; lawyer connection or referral.
- Repo commit window: no repo found. The build window was 24 hours by event rules.

## Stack
Not determinable ("AI-powered", plus "legal expertise" from the team's lawyer input).

## Submission page shape
- Images: not determinable.
- Sections present: not determinable (organizer awards page plus a magazine write-up; no Devpost).
- Led with: the user benefit to the worker (understand, plain language, connect, lower cost), not the technology.

## Context: the runner-up signal at the same event
The **Impact Award** went to the Amici Curiae team (Jenny Gu, Mary Childs, Ian Rodriguez, Lakshay Sethi, Jade Li, Jennifer Buckley) for "a multilingual voice and text-based intake tool designed to help community legal services collaborate on shared client files". The source is the same two pages, via search index. Both top awards went to **first-mile, plain-language, human-in-the-loop** tools, not to autonomous "AI lawyer" products.

## Why this won (one sentence)
It served an ordinary worker rather than a law firm, turned an intimidating document into plain language, and **routed to a human lawyer instead of pretending to be one**. That covered every item on the Champion's rubric (scope, impact, innovation, usability, technical execution) within a 24-hour build.

## Transferable to us
- **Copy:** a lay-user, access-to-justice framing, with a flow of **understand → plain language → hand off to real help**. The hand-off is the product's documented restraint and makes "not legal advice" part of the design rather than a disclaimer.
- **Copy:** the judging language. The Champion's criteria (scope, impact, innovation, usability, technical execution) overlap almost one-to-one with LexHack's rubric (Impact & Feasibility 25, Technical 25, UX 20, Innovation 15, Presentation 15), so this is the closest rubric analogue in this lane.
- **Copy:** lead the pitch with the user's outcome, not the model.
- **Improve on:** the plain-language output must be **traceable to the source clause**, which is the Hookline lesson: never emit words the document didn't say. The referral step should point to *real, verifiable* resources (for example official legal-aid directories), not invented contacts.
- **Caution:** an in-person, one-day, 60-person event with no public artifacts. The judging signal is transferable, but we have no build to benchmark against.
