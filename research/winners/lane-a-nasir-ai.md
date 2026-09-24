# Winner brief — Nasir.AI

**Hackathon:** Inaugural LLM x Law Hackathon, hosted by King's Entrepreneurship Lab with Stanford CodeX, King's College, Cambridge (UK), 22–23 Jun 2024. The team's repo calls it "Cambridge Hack The Law 2024". One search summary of the organizer's pages describes a 15-hour build on problem statements supplied by sponsors; that summary mixed figures from more than one edition, so treat the length as unconfirmed. · **Prize won:** **Second Prize**, plus the **Stanford CodeX category prize "for creating an agentic solution"**, per the organizer's blog. The team's repo says "2nd place … winning $6500".
**Submission URL:** https://www.kingselab.org/blog/hackathon2024 (organizer results post; no Devpost) and https://www.kingselab.org/blog/nasir-ai (organizer feature on the project) · **Repo:** https://github.com/Daspy11/hacklawcambridge · **Demo video:** none found
**Verified:** page loaded ☐ · prize stated on page ☑ (the team's own repo README, loaded via `git clone`: "Nasir.AI - 2nd Place") · video played ☐
**How verified:**
- kingselab.org is blocked by egress (WebFetch returned EGRESS_BLOCKED). Two differently worded WebSearch queries returned the organizer's own pages. `kingselab.org/blog/hackathon2024`, summarised: "On June 23rd, the King's Entrepreneurship Lab hosted its inaugural LLM X Law Hackathon … Nasir.AI won Second Prize". `kingselab.org/blog/nasir-ai`, summarised: "Nasir.AI was awarded the second-place prize, as well as the Stanford CodeX category prize for creating an agentic solution."
- Primary source: I cloned the repo and read the README, all 18 commits, the backend and the frontend. The repo description names the team: Stuart Johnson, Vid Kocijan, Robin Van Aeken, Zahra Farzanekhoo, Hana Šerbec. I did **not** run it: it calls AWS Bedrock with credentials that were hardcoded in the source and have long since expired.
- The prize money ("$6500") is the team's own figure and was not seen on an organizer page.

## Pitch, verbatim
> "Nasir.AI helps businesses enforce the execution of their supply contract terms by using a two-stage pipeline to identify the contract terms, create executable code to monitor their fulfilment, and autonomously notify relevant stakeholders, such as payables teams and suppliers. It provides an explainable, scalable, and private solution for businesses to measure the adherence to contracts, enhance contract monitoring, empower procurement teams, and aid in preventing supply chain disruption."

(The quote is the search-index rendering of the organizer's results post and was not read on a loaded page.) The repo README, verbatim: "The code that checks your file for conditions and checks your database for contract breaches."

## The wow moment
You upload a real-looking supply contract (`contract.docx`: BMW buying copper cable from "Slovenia Copper d.o.o."). Every extracted obligation then comes back as a **Green / Red / "Could not determine"** verdict. For each clause the LLM wrote a small pandas program, the program was *executed* against the company's delivery records, and the program itself is returned alongside the verdict, which is the "explainable" part. No video was found, so no timestamp.

## Demo teardown
- Length: not determinable (no video found). The README says "Everything here was built in a few hours ahead of our demo", so there was a live in-room demo.
- First 15 seconds show: not determinable.
- Narrated? Captioned? Live or recorded? A live demo is implied by the README. Nothing else is determinable.
- Real data or hardcoded? **Mixed.** The contract→verdict path is real: the Flask route `/process-file/` → `extractor.test_a_doc()` → Llama 3 70B on Bedrock → `exec()` of the generated pandas code against `deliveries.csv`, a 2-row sample. **But** the dashboard's contract list is hardcoded JSX (placeholder counterparties "Globex Inc.", "Acme Inc.", "Stark Industries"). The prompt references a `transactions.csv` that was never committed. "Notify Supplier" is a button label with no notification code behind it.

## Scope reality
- Features actually shown working (from code reading): clause/condition extraction to JSON (one LLM call, temperature 0); per-condition code generation plus execution, returning Green/Red/unknown with the generated program; file upload from a React + shadcn/ui frontend to the Flask API.
- Features only described: "autonomously notify relevant stakeholders" (no email, Slack or notification code in the repo); "scalable, and private"; automatic database-schema description (a code comment says it "can be automatically generated … but here we keep it simple for the demo"); JSON validation and retries (the code raises "On the real product we would implement validation and retries").
- Repo commit window: 18 commits from **10:26 to 20:10 BST on 23 Jun 2024** (about 10 hours, all on event day), plus one README edit on 13 Jul 2024. The build ran backend-first: "extractor code, untested" at 14:01, "tested backend" at 15:14, "The whole frontend" at 16:11, "fastapi to flask" at 16:37.

## Stack
Python, Flask, pandas and python-docx on the backend; AWS Bedrock (`meta.llama3-70b-instruct-v1:0`) as the model; React, Vite, Tailwind and shadcn/ui on the frontend; Docker Compose scaffold. The stack itself was not the story. The *agentic pattern* was (LLM writes code → code runs against real records → verdict), and it won the CodeX "agentic solution" category. The code has real risks: it `exec()`s LLM-generated code and it committed temporary AWS session credentials (next to the comment "# what even is security").

## Submission page shape
- Images: not determinable (organizer pages blocked; no Devpost). The repo has no screenshots.
- Sections present (repo README): title with placement → one-line description → Code organisation → Includes → Dependencies → Getting Started (including a step that starts Chrome with `--disable-web-security`).
- Led with: the placement ("took 2nd place at Cambridge Hack The Law 2024").

## Why this won (one sentence)
It turned a sponsor-shaped, unglamorous problem (are suppliers actually meeting the contract?) into a visible closed loop: the LLM extracts obligations, writes code that runs against the data, and returns a traffic-light verdict with its reasoning attached. That is concrete, demoable "agentic" behaviour at a moment when the judges were rewarding exactly that.

## Transferable to us
- **Copy:** the *per-clause verdict with its evidence attached* pattern. Every output row shows why (the rule, the data it was checked against, the result). Our version should be deterministic or on-device, with the trace shown in the UI. That serves both "Technical Execution" and "UX".
- **Copy:** a three-state result that includes "Could not determine". Honest uncertainty is a feature (our LIMITATIONS.md and UI should show it).
- **Copy:** a single tight demo path on one realistic sample document.
- **Don't copy:** hardcoded dashboard rows that look like live data; features named in the pitch but not built (notifications); `exec()` of model output; committed secrets; a setup that needs security-disabled Chrome. Every one of these would break our "cold judge visit never fails" and "no fabricated features" rules.
- Note: B2B procurement audience, a 5-person team, in-person judging. Borrow the demo mechanic, not the audience.
