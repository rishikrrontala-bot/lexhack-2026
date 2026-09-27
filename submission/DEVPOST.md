# Paste into Devpost

**Name:** In Its Place

**Tagline:** Paste a D.C. bill. Read the law it would make, with every supported edit traced to its source sentence.

**Track:** Legal Automation & Workflow Innovation (primary); Digital Rights & Policy Tech if multiple tracks are allowed.

## Inspiration

A bill often describes changes to existing law without printing the result. A reader must perform each edit by hand, and a single missed paragraph can change the meaning.

## What it does

In Its Place puts a bill beside the D.C. Code section it amends. It compiles editing instructions into traceable operations, applies them to a historical Code snapshot, and shows before and after wording. The live demo uses D.C. Law 25-108 and § 38-501. It identifies twelve scoped instructions. If a phrase cannot be found, the proof flags a query instead of making up a change.

## How we built it

The parser segments the Council's public law XML into provisions, resolves nested section and paragraph references, and turns drafting verbs into edit operations. A pure TypeScript applier edits a tree built from the Council's historical Code XML. Vite builds a static site; no API key or backend is needed. The original XML snapshots and data generation script are in the public repo.

## Challenges

Bill text is nested, but its targets are often implied by earlier clauses. Quotation marks, punctuation and whitespace matter when a phrase must be struck exactly. The Council's later codification includes editorial changes, so we show the gap rather than label replay a perfect match.

## Accomplishments

The prototype turns twelve instructions in a real law into a clickable proof of one Code section. Every displayed mark links back to its bill sentence. The real-law integration test covers the amended paragraph and refusal path for an absent phrase.

## What we learned

Legal automation needs inspectable provenance and a visible refusal path. The hardest part is deciding exactly which historical text an instruction is allowed to change.

## What's next

Expand section coverage and drafting grammar, add measured replay benchmarks across Council publication history, and distinguish legislative text changes from codifier editorial updates.

**Built with:** TypeScript, Vite, D.C. Council public law XML, D.C. Council codified XML, Public Sans, Charis SIL.

**Live:** https://rishikrrontala-bot.github.io/lexhack-2026/

**Code:** https://github.com/rishikrrontala-bot/lexhack-2026

**AI-use disclosure:** Rishik Rontala directed development with Claude Code (Anthropic) as an AI coding agent. The running product uses a deterministic parser and does not call an AI model.

**Legal boundary:** Prototype for civic understanding, not legal advice or an official publication. The site is scoped to one D.C. Code section and names publication differences.
