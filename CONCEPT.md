# CONCEPT: In Its Place

**Event:** LexHack 2026 · **Track:** Legal Automation & Workflow Innovation (secondary: Digital Rights & Policy Tech)
**Jurisdiction:** District of Columbia, D.C. Official Code, as published by the Council of the District of Columbia
**One line:** Paste a D.C. bill and read the law it would make, with every change redlined and traced to the sentence that made it.

## The problem
Bills don't contain the law they create. They contain edit instructions: *"Paragraph (2) is amended by striking the phrase 'that the student is immunized' and inserting the phrase '…' in its place."* To know what a bill does, you must find the right section of the D.C. Code, find the right paragraph, and apply every strike and insert by hand. Congress considers this important enough that its rules require "comparative prints" (the Ramseyer rule) and the House built a Comparative Print Suite in 2022, but that tool is for House staff, behind a firewall. D.C. residents, advocates and journalists reading a Council bill get the instructions and nothing else.

## What it does
1. **Compile.** A deterministic legal-language parser reads the bill's amending text: targets (§ 38-501 → paragraph (2) → subparagraph (B)), operations (strike, strike-and-insert, amend to read, repeal, add new, redesignate) and quoted payloads.
2. **Apply.** An edit engine runs those operations against the official D.C. Code XML the Council publishes on GitHub.
3. **Show.** The result is a redline (struck text ruled out, new text inked in) plus the clean resulting law. Hover any sentence of the bill to see exactly what it changed.
4. **Check.** A drafting linter flags anything that can't apply cleanly: a phrase that isn't there, a phrase found more times than instructed, a paragraph that doesn't exist, numbering collisions, leftover double spaces and stranded punctuation.
5. **Prove.** Replay any enacted D.C. law against the Code as it stood the day before, then compare with what the Council's codifiers actually published. The accuracy page reports the engine against **11,638 gold edit operations** (Council Periods 23–26) and **389 point-in-time snapshots** of the Code.

## Wow moment (first 15 s of the video)
A dense paragraph of a real D.C. law, then one click, and the D.C. Code section rewrites itself in place: words strike, phrases ink in, and each change glows back to the sentence of the bill that caused it. The badge reads: *identical to the Council's published text.*

## Built on
Vite + TypeScript, pure-function parser and engine with Vitest, Playwright e2e, GitHub Pages. No LLM and no API key: this step of law has to be exact, auditable and reproducible, so the engine is deterministic and measured. Data comes from [`DCCouncil/law-xml`](https://github.com/DCCouncil/law-xml) and [`DCCouncil/law-xml-codified`](https://github.com/DCCouncil/law-xml-codified), refreshed by a scheduled GitHub Action.

## Boundaries
Not legal advice and not an official publication of D.C. law. The official text is at [code.dccouncil.gov](https://code.dccouncil.gov/us/dc/council/code). Every instruction the engine can't parse or apply is shown as "needs a human", never guessed.

*Full scoring of the three candidate concepts: [`research/CONCEPTS.md`](research/CONCEPTS.md).*
