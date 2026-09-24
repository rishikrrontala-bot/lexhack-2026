# Winner brief — CounterClaim Eagle

**Hackathon:** LLM x Law Hackathon 2025, Cambridge (UK). Run by King's Entrepreneurship Lab with Stanford CodeX, hosted at Cambridge Judge Business School and listed by the student society Hack_the_Law Cambridge as its 2025 hackathon. 20–22 Jun 2025, in person, **students only**. Sources give the field as "250+ students from 33 universities" (EdTech Innovation Hub) or "students from 43 universities … 14 countries" (momen.app); the two figures disagree. · **Prize won:** **1st place, Hacker Track, £10,000.** Also the **Stanford CodeX x Jus Mundi Challenge** winner. Built by **Julia Volovich**, a mathematics undergraduate at Trinity College, Cambridge, who **competed solo**.
**Submission URL:** https://hackthelaw-cambridge.com/hackathon-2025/ (organizer results page; no Devpost for this event). Project write-up: https://www.kingselab.org/blog/julia-volovich ("Teaching AI to Play Chess with the Law") · **Repo:** none found (GitHub repo search and code search for "CounterClaim Eagle" returned 0 results) · **Demo video:** none found
**Verified:** page loaded ☐ · prize stated on page ☐ · video played ☐
**How verified:**
- hackthelaw-cambridge.com, kingselab.org and edtechinnovationhub.com are all blocked by this container's egress proxy (WebFetch returned EGRESS_BLOCKED). I did not load any of these pages.
- Six differently worded WebSearch queries returned the same facts from **four independent sites**:
  1. `hackthelaw-cambridge.com/hackathon-2025/` (organizer), per the index summary: "CounterClaim Eagle won the 2025 LLMxLaw Hackathon (£10,000) and also won the Stanford CodeX x Jus Mundi Challenge."
  2. `kingselab.org/blog/julia-volovich` (organizer), per the index summary: Julia Volovich "won the Hacker Track … with CounterClaim Eagle".
  3. EdTech Innovation Hub, "Two Jus Mundi-mentored teams win Cambridge University hackathon…". A Law360 headline, "Jus Mundi Mentees Triumph In AI Hackathon At Cambridge U", also came up, but I saw only its title. EdTech index summary: "A £10,000 prize was awarded to the first placed Julia Volovich, a mathematics undergraduate at Trinity College, Cambridge who competed solo."
  4. momen.app, "Building Legal Innovation with No Code: Highlights from the LLM × Law Hackathon 2025", which repeats the £10,000 win.
- The prize, the amount, the name and the solo entry are consistent across all four. I could see no build artifact (repo, video or screenshots), so the teardown below comes from written descriptions only.

## Pitch, verbatim
> "CounterClaim Eagle is an AI Co-Counsel tool which leverages advanced LLM agents and a risk simulator to challenge opposing arguments with precision and depth. It tests counterclaims against precedent, highlights weaknesses in rival positions, and simulates litigation outcomes using Monte-Carlo methods."

*(This wording came back identically from index summaries of hackthelaw-cambridge.com and kingselab.org. I could not open either page to confirm it character for character.)*

Further described (same sources): "By programmatically analysing large volumes of case material, it crafts data-backed rebuttals and delivers them with visual clarity. Built-in safeguards—such as citation-backed responses, code-driven calculations, and programmatic prompting—ensure reliable, scalable performance even on complex or lengthy legal documents."

## The wow moment
Not determinable from available sources, because no video or screenshots were found. The descriptions point to the **Monte-Carlo litigation-outcome simulator** as the differentiator: it turns "how strong is this counterclaim?" into a distribution of outcomes rather than a chatbot opinion. That is my inference from the pitch, not an observed moment.

## Demo teardown
- Length: not determinable (no video found).
- First 15 seconds show: not determinable.
- Narrated? Captioned? Live or recorded?: not determinable. The event was in person with judged presentations. Global Arbitration Review later ran "Lessons on AI from the Hackathon", but its index summary mixes in a different hackathon (GAR-LCIA), so I do not rely on it.
- Real data or hardcoded?: the challenge supplied a real-style dataset. The brief (per the EdTech Innovation Hub summary) was "Building the Lawyer's Digital Mind": an LLM assistant for "a high-stakes arbitration scenario that involved an environmental counterclaim against a multinational mining firm", acting as "strategic co-counsel evaluating legal strategies, identifying factual and jurisprudential weaknesses, benchmarking against relevant case law accessed through the Jus Mundi API, and proposing stronger alternatives."

## Scope reality
- Features actually shown working: not determinable first-hand. Described: counterclaim testing against precedent via the Jus Mundi case-law API, weakness spotting in rival positions, a Monte-Carlo outcome simulator, and a visual presentation of rebuttals.
- Features only described: cannot separate from the above without a demo.
- Repo commit window: no repo found. The event ran 20–22 Jun 2025.

## Stack
Not determinable. "LLM agents", "code-driven calculations" and "programmatic prompting" are the only stack signals. Jus Mundi's case-law API was part of the sponsor challenge. The stack was not the story; the method was: agents for reading, deterministic code for the numbers.

## Submission page shape
No Devpost. The organizer published a results page and a long-form feature on the winner, titled around an analogy ("Teaching AI to Play Chess with the Law"), which frames legal argument as strategic search. Sections and images: not determinable. Search results also returned chess-rating profiles under the same name, but I could not confirm they are the same person, so I make no claim about it.

## Why this won (one sentence)
A solo student answered a sponsor's hard, specific brief (arbitration co-counsel over a real case-law API). She added the one thing the other entries lacked, **quantified outcome simulation computed in code rather than generated by the LLM**, and wrapped it in explicit reliability safeguards (citations, code-driven numbers) that lawyer-judges trust.

## Transferable to us
- **Copy:** a solo entrant can take first prize at a student law hackathon when the entry has a real **method**, not just a chat UI. Put the numbers in deterministic code ("code-driven calculations") and let the LLM do reading only. Name the safeguards on screen: citation-backed answers, and numbers never generated by the model.
- **Copy:** give the analysis a strong mental model (chess / game tree → litigation). Judges remember an analogy.
- **Copy:** anchor to a real dataset or API the judges recognise. For us, that means real statute or regulation text with links.
- **Do not copy:** "simulates litigation outcomes" is a strong claim, and LexHack's rules reward restraint ("not legal advice"). Any simulator we build must show its assumptions and must not present predicted outcomes as advice.
- **Same event, other winner:** "Hallucin8" by team AI4G took the **Founder's prize** as "an AI auditor for legal hallucinations" (index summaries of hackthelaw-cambridge.com/hackathon-2025, seen twice). Legal-hallucination and citation auditing is therefore a proven, already-rewarded concept. At least two LexHack 2026 entrants are already building it: `github.com/1012aaditya/Leckhack` ("The Citation Auditor") and `github.com/Chinesezjc/citeproof`. Both READMEs say "LexHack 2026", and I checked both. Avoid that lane.

**Sources:** https://hackthelaw-cambridge.com/hackathon-2025/ · https://www.kingselab.org/blog/julia-volovich · https://www.edtechinnovationhub.com/news/two-jus-mundi-mentored-teams-win-cambridge-university-hackathon-advancing-ai-innovation-in-legal-research · https://www.law360.com/articles/2360893/jus-mundi-mentees-triumph-in-ai-hackathon-at-cambridge-u · https://momen.app/blogs/hack-the-law-cambridge-2025/ (all seen only as search-index snapshots, 2026-09-24)
