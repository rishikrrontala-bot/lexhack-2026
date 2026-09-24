# The LexHack 2026 field (as of Wed Sep 23, 2026, ~11 PM ET)

The Devpost gallery for this event is blocked by this session's egress policy (`*.devpost.com`), so this map of the field was built another way:
WebSearch found public GitHub repos that call themselves LexHack 2026 entries, and each one below was **cloned and its README read** in this session.
Entries without a public repo are invisible to this method, so treat this as a floor on crowding, not a census.

| Entry | Repo (cloned) | Track(s) claimed | What it does | Evidence of polish |
|---|---|---|---|---|
| Citation Auditor | [1012aaditya/Leckhack](https://github.com/1012aaditya/Leckhack) | (research doc lists all five) | Checks whether cases cited in AI-written legal text exist, support the claim, and are still good law | FastAPI + Docker, offline twin for every live component |
| CiteProof | [Chinesezjc/citeproof](https://github.com/Chinesezjc/citeproof) | AI Safety, Ethics & Governance; Access to Justice | Citation audit against CourtListener: `verified / fabricated / miscited / unverifiable` | 29-citation benchmark, 28/29 verdict accuracy reported |
| Annex | [shi1720/LexHack](https://github.com/shi1720/LexHack) | (AI governance) | Scans a codebase and maps it to EU AI Act obligations, with file/line evidence + hashes | CLI + live Firebase demo + 2:45 YouTube video + benchmark doc |
| Overturn | [Chinorab/overturn](https://github.com/Chinorab/overturn) | Access to Justice (primary), Legal Automation | Explains and contests a US health-insurance denial; drafts the appeal letter | Live Vercel demo + 2:21 video; KFF statistics cited |
| Hearing-Ready | [sharonbasovich/hearing-ready](https://github.com/sharonbasovich/hearing-ready) | (Access to Justice) | Local-first evidence-bundle compiler for Ontario LTB tenant hearings | Live GitHub Pages demo + 2-min video; PDF export; tests |
| Recourse | [shivansh193/recourse](https://github.com/shivansh193/recourse) | Access to Justice / Digital Rights | California small-claims SC-100 drafting grounded in CCP text, with self-verification | Next.js 16; in progress (plan runs to Sep 27–28) |
| On Our Terms | [TONZHub/OnOurTerms](https://github.com/TONZHub/OnOurTerms) | (AI governance / digital rights) | Builder for a human–AI companion "relationship agreement" | Prototype |
| LexisGuide | [k1lst1x/LexisGuide](https://github.com/k1lst1x/LexisGuide) | (Access to Justice) | Flags unfair terms in legal documents, explains in plain language | FastAPI + React |
| Lexmini | [inn-0/lexmini](https://github.com/inn-0/lexmini) | (Legal Automation) | Review/tokenise sensitive fields in judgments; governed reveals | Live Replit demo |
| privacy-policy-intelligence | [ck399/privacy-policy-intelligence](https://github.com/ck399/privacy-policy-intelligence) | (Digital Rights) | AI privacy-policy analyzer | Repo found via search, README empty at clone time |
| Legal First Aid | VenkataSRT/legal-first-aid (search result; clone refused, so the repo is private or renamed) | Access to Justice | Speak a problem, get rights + document check + referral, multilingual | Not verifiable |

## What the field tells us

1. **The bar is high and mostly AI-agent-built.** At least four entries (Annex, CiteProof, Overturn, Hearing-Ready) ship a live demo, a 2–3 minute video, measured numbers and honest limitations. "Complete and tested" is table stakes here, not a differentiator.
2. **Access to Justice is the most crowded lane**: consumer-facing "understand your problem, draft your document" tools for insurance denials, tenant hearings, small claims, unfair terms and multilingual first aid.
3. **Citation hallucination is taken twice** (Citation Auditor, CiteProof), and AI-Act compliance has a very strong entry (Annex).
4. **Nobody is working on legislation itself.** Every entry acts on *documents people receive* (denials, leases, briefs, policies, codebases). No entry touches *how law is written and changed*: bills, amendments, codification. That is open ground.
5. **Least contested track, on this evidence: Legal Automation & Workflow Innovation.** Only Overturn lists it, and only as a secondary track.
