# Product

<!-- impeccable:product-schema 1 -->

> **How this record was made.** Rishik set this cloud run up unattended ("I'm not available to answer questions; every decision is yours"), so the impeccable init interview could not run. Everything below comes from the written brief (CLAUDE.md, HACKATHON.md, PROMPT.md), the concept research in `research/`, and data verified in this session. Facts that are **inferred** rather than confirmed are marked *(inferred)*.

## Platform

web

## Stack
Delegated: Vite + TypeScript, no framework runtime. Pure-function domain logic (parser, edit engine, diff, linter) tested with Vitest, Playwright e2e on the demo path, static deploy to GitHub Pages with relative asset paths. This follows CLAUDE.md's engineering defaults: static-first, no required backend, no API key.

## Users
- **Primary: someone reading a D.C. Council bill who needs to know what the law would say if it passed.** A resident preparing hearing testimony, a tenant or worker advocate tracking a bill, a reporter covering the Council. They hold a bill (a PDF from the Council's legislative system, or text copied from it) and have minutes, not hours. *(inferred from the problem; no users were interviewed)*
- **Secondary: people who write or check amendments.** Council and agency drafters, legal-aid attorneys, law and policy students. They want to know whether each instruction applies cleanly to the current Code. *(inferred)*
- **Evaluators: LexHack 2026 judges.** They see the demo video first and may open the live site for a few minutes. They judge Impact & Feasibility (25%), Technical Execution (25%), UX & Design (20%), Innovation (15%) and Presentation (15%).

## Product Purpose
Bills are written as edit instructions against existing law ("strike 'X' and insert 'Y' in its place"), so a bill never shows the law it produces. In Its Place compiles a D.C. bill's amending instructions, applies them to the official D.C. Code, and shows the resulting law as a redline. Every change is traced back to the sentence that caused it, and every instruction that can't apply cleanly is flagged.
**Success:** a first-time visitor understands what a real bill would change within one screen. A drafter sees an instruction fail before it becomes law. The engine's accuracy is published, reproducible, and measured against the Council's own codifiers.

## Positioning
The only public, open tool that turns D.C. amending language into the resulting law **and measures itself against the codifiers**. Each replayed law is checked against the Council's published point-in-time Code, and the parser is scored against the codifiers' own machine-readable edits. Congress has an equivalent (the House Comparative Print Suite), but only for House staff behind its firewall.

## Operating Context
- Source documents: D.C. bills, acts and laws as published by the Council of the District of Columbia. The machine-readable versions live in [`DCCouncil/law-xml`](https://github.com/DCCouncil/law-xml); the point-in-time Code lives in [`DCCouncil/law-xml-codified`](https://github.com/DCCouncil/law-xml-codified), with 389 publications from Oct 2021 to Sep 16, 2026.
- Legal vocabulary the UI must use correctly: section (§), subsection (a), paragraph (1), subparagraph (A), sub-subparagraph (i); strike, insert, "amended to read as follows", repeal, redesignate; D.C. Law vs. D.C. Act vs. Bill; effective date; codification.
- Usage moments: before a hearing, while writing an explainer, while drafting, and during a quick judge visit.

## Capabilities and Constraints
- Jurisdiction is **District of Columbia only**, and the UI says so. Code text is the Council's published XML, with links to [code.dccouncil.gov](https://code.dccouncil.gov/us/dc/council/code).
- **Not legal advice, and not an official publication.** Both are stated in the UI, next to results and in the footer.
- Deterministic: no LLM, no network calls at runtime beyond this site's own static data. Anything that can't be parsed or applied is shown as *needs a human* with the reason. Nothing is guessed.
- Works logged-out, keyless and offline-capable after first load. Works at 375 px wide. WCAG 2.2 AA.
- Undecided *(open)*: whether pending (introduced, not enacted) bills get a curated example set. That depends on whether their text is reachable from open data at build time.

## Brand Commitments
- Name: **In Its Place**, taken from the closing formula of D.C. amending instructions ("… and inserting the phrase 'Y' **in its place**").
- Credit line: "Built by Rishik Rontala" visible on the site, plus `<meta name="author" content="Rishik Rontala">`.
- Must not share a visual template with Rishik's other 14 hackathon entries. Banned: purple/blue gradients, centered-card SaaS templates, emoji headers, Playfair + drop shadows, 3D blobs, stock hero illustrations. The portfolio's bone/ink/terra palette and Archivo display belong to the portfolio, not to this product.

## Evidence on Hand
- Real data: D.C. laws with codifier annotations. There are **11,638 gold edit operations** in Council Periods 23–26, counted in this session (`research/CONCEPTS.md`), and 389 Code snapshots.
- Real precedent: the House Comparative Print Suite ([POPVOX Foundation](https://www.popvox.org/legislative-technology/comparative-print-suite)) and the Ramseyer rule, House Rule XIII cl. 3(e) ([CRS R46790](https://www.congress.gov/crs-product/R46790)).
- **Absent, and must never be fabricated:** users, interviews, testimonials, usage numbers, endorsements from the Council or anyone else, adoption claims. Accuracy numbers may only appear if the committed benchmark script produced them.

## Product Principles
1. **Show the law, not the instructions.** The resulting text is the hero, and the bill is the annotation.
2. **Every change has an author.** Each strike or insert links to the exact sentence of the bill that caused it, and back.
3. **Abstain loudly.** When the engine is unsure, it says so, with a reason. It never guesses in the direction of looking finished.
4. **Measured, not claimed.** Accuracy is computed against the codifiers and reproducible with one command.
5. **Plain words around precise text.** Legal text is shown verbatim, and the UI around it speaks plainly.

## Accessibility & Inclusion
WCAG 2.2 AA. Redline meaning must never rely on color alone: deletions carry strikethrough plus "deleted" semantics (`<del>`), insertions carry underline plus `<ins>`, and screen readers announce each change. Keyboard paths reach every instruction ↔ change link. Respect `prefers-reduced-motion`: the redline appears fully drawn, with no animation.
