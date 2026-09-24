# PROGRESS: LexHack 2026 (Rishik Rontala)

**Deadline:** Sun Sep 27, 2026 · 5:00 PM EDT (`2026-09-27T17:00:00-04:00`)
**Internal "all deliverables done" target:** Sat Sep 26, 2026 · 5:00 PM EDT (≥24 h early, per CLAUDE.md lesson 2)
**Live URL:** https://rishikrrontala-bot.github.io/lexhack-2026/ · **Branch:** `claude/optimistic-mayer-9qzmqa` → `main`

## Countdown log
| Phase start (ET) | Hours to deadline | Hours to internal target |
|---|---|---|
| Wed Sep 23 · 10:32 PM (Phase 0) | 90.5 | 66.5 |
| Wed Sep 23 · 10:54 PM (Phase 5 start, save point) | 90.1 | 66.1 |
| Wed Sep 23 · 11:03 PM (stopped at Rishik's request) | 89.95 | 65.95 |

## Phase plan (budgeted backwards, hackathon-win Phase 4 table, over the 66.5 h to the internal target)
| # | Phase | Budget | Target finish (ET) | Status |
|---|---|---|---|---|
| 0 | Countdown + tool check | 0.5 h | Wed 11:00 PM | done |
| 1–2 | Research: verify event facts, 5–8 winner briefs, RESEARCH-BRIEF | 4 h | Thu 3:00 AM | done |
| 3 | Concepts ×3 scored, pick, CONCEPT.md pushed | 1 h | Thu 4:00 AM | done |
| 4 | Design direction: PRODUCT.md + DESIGN.md | 1.5 h | Thu 5:30 AM | done |
| 5 | Core build (~50%): wow moment → demo path → rest, tests, CI, deploy | 26 h | Fri 7:30 AM | in progress |
| 6 | Quality passes: critique → audit → polish, live headless check | 6 h | Fri 1:30 PM | |
| 7 | Demo video (~20%) | 8 h | Fri 9:30 PM | |
| 8 | Submission kit (~15%) | 8 h | Sat 5:30 AM | |
| 9 | Ship: merge to main, verify live, HANDOFF.md | 2 h | Sat 7:30 AM | |
| — | Buffer (~15%) for whatever breaks | ~9.5 h | Sat 5:00 PM | |

## Tool check (Phase 0/1)
- Node v22.22.2, npm 10.9.7. Playwright Chromium present at `/opt/pw-browsers` (chromium-1194 + headless shell).
- ffmpeg: Playwright's bundled ffmpeg only (VP8), so installing the system ffmpeg (libx264) for the H.264 video.
- n8n: `N8N_BASE_URL` is **unset**, so there is no API access. Any workflow would ship as an importable `n8n/*.json` with a HANDOFF step.
- Skills loaded in session: `dataviz`, `anthropic-skills:ui-demo`, `anthropic-skills:make-interfaces-feel-better`, `anthropic-skills:accessibility`.
- Missing, so using the CLAUDE.md fallback clones at `/tmp/skills`: `impeccable` (pbakaus/impeccable), emil `animate` + `emil-design-eng` (emilkowalski/skills), taste-skill (leonxlnx/taste-skill). `hypersite` has no public fallback repo. Its role (the marketing/landing surface) is covered by impeccable + taste-skill.

## Log
- **Wed 10:32 PM ET:** session start. Read CLAUDE.md, HACKATHON.md, the hackathon-win skill + references + templates. Created PROGRESS.md.
- **Wed ~10:40 PM ET:** Devpost, .gov statute sites, Wikipedia, archive.org, YouTube, HF, jsDelivr and `*.github.io` are **blocked by this environment's egress policy**. WebSearch, GitHub (git clone + raw), npm, PyPI, Google Fonts and the Ubuntu apt mirror work. Research ran through search-index snapshots and cloned repos (method in `research/RESEARCH-BRIEF.md`). The live Pages URL can't be loaded from here, so post-deploy verification must run as a GitHub Actions job.
- **Wed ~10:45 PM ET:** 8 winner briefs (`research/winners/`), field map (`research/COMPETITION.md`, 11 LexHack entries cloned), brief (`research/RESEARCH-BRIEF.md`). Concept picked: **In Its Place** (score 4.40 vs 3.70 / 3.35, see `research/CONCEPTS.md`). CONCEPT.md pushed.
- **Wed ~10:50 PM ET:** PRODUCT.md, DESIGN.md, impeccable surface brief (`.impeccable/surfaces/index-html.md`, direction = prepress galley proof + proofreader's marks, seed 8717fc72, degraded roll). package.json scaffolded (Vite 8, Preact, TS 5.9, Vitest 5, Playwright 1.56.1 to match the preinstalled chromium-1194).
- **Wed 10:54 PM ET: save point (Rishik asked to save by 11:20 PM ET).** Build started: `src/engine/types.ts` written.

## RESUME HERE (for a fresh session)
Data lives in two public repos, which are **not** committed here. Re-create them with:
```bash
mkdir -p /tmp/dc && cd /tmp/dc
git clone -q --depth 1 --filter=blob:none --sparse https://github.com/DCCouncil/law-xml.git law-xml
cd law-xml && git sparse-checkout set --no-cone '/*.md' us/dc/council/periods/23/laws us/dc/council/periods/24/laws us/dc/council/periods/25/laws us/dc/council/periods/26/laws && cd ..
git clone -q --filter=blob:none --no-checkout https://github.com/DCCouncil/law-xml-codified.git codified
cd codified && git fetch -q --filter=blob:none origin 'refs/heads/publication/2026-05-23.2026-09-16:refs/remotes/origin/latest'
git sparse-checkout set --no-cone us/dc/council/code/ && git checkout -q origin/latest
# then in the repo: ln -sfn /tmp/dc/law-xml data-cache/law-xml; ln -sfn /tmp/dc/codified data-cache/codified
```
Key data facts:
- Laws: `law-xml/us/dc/council/periods/<P>/laws/<P>-<n>.xml`. Gold edits are `codify:find-replace|insert|replace|repeal|redesignate-para` elements (skip ones inside XML comments). The target path is the chain of `codify:path` attributes on ancestors, plus the op's own `path`. Also: `position="last|first"`, `count="N"`, `after`, `num-value`.
- Code: `codified` has 389 linear publication commits. Commit **subjects** carry the publication date (commit dates were rewritten). Sections are at `us/dc/council/code/titles/<T>/sections/<num>.xml`. Each section's `<annotation type="History" doc="D.C. Law X" target-path=...>` names the laws that changed it, so before/after = the first commit whose section file contains that doc, and its parent.
- Codifiers apply strikes literally (double spaces and "student ." artifacts survive in § 38-501), so the engine must not clean whitespace, and the linter flags these artifacts.

Next steps, in order:
1. `src/engine/*`: text utils, segmenter (bill text → provisions + quoted blocks), citation/path parser, grammar (sentence → ops), compile (context stack), code model, apply (marked-segment tree with op provenance), lint, word diff. Vitest for each.
2. `scripts/lib/dcxml.ts` (law XML → bill-like text + gold ops; code XML → CodeNode JSON), `scripts/benchmark.ts` (parse agreement vs gold + replay vs codified snapshots → `public/data/benchmark.json` + `research/BENCHMARK.md`), `scripts/build-data.ts` (examples + per-title code JSON).
3. UI (Preact) per DESIGN.md + surface brief. Then CI workflow + post-deploy Playwright smoke on GitHub runners.

## STOPPED Wed Sep 23, ~11:03 PM ET (Rishik asked to push everything and stop at 11:06 PM)
**Built so far (all pushed):**
- Engine in `src/engine/`: `types.ts`, `text.ts` (quote/whitespace-tolerant matching), `code.ts` (Code tree, path lookup, official URLs), `segment.ts` (bill text → provisions + quoted blocks; strips PDF line numbers), `grammar.ts` (instruction sentence → targets + ops), `compile.ts` (context stack → Instructions).
- `scripts/lib/dcxml.ts`: law XML → bill-like text + gold ops; Code section XML → CodeNode JSON. `scripts/lib/signature.ts`: comparable signatures for gold vs engine.
- `scripts/spike/parsebench.ts` (run: `npx tsx scripts/spike/parsebench.ts 23,24,25,26`) scores parse agreement vs the codifiers' gold. `scripts/spike/dbg.ts <period> <n>` prints a law's provisions and compiled instructions.

**Current parse agreement (413 permanent laws, P23–26):** recall 30.4%, precision 68.3% (find-replace 35% / 79%, replace 44% / 89%, repeal 30% / 94%, insert 19% / 42%). This is **work in progress, not a result**, so don't quote it anywhere.

**Biggest miss buckets** (snapshot in `research/.parse-misses-snapshot.txt`), which are the next fixes:
1. "A new paragraph/subsection (x) is added to read as follows:" (~700 misses). The gold key is `IN|<container>|<num>`. Check that the container resolves to the parent context (not the act-level section) and that `num` matches.
2. "Paragraph/Subsection (x) is amended by striking the phrase … and inserting …" (~300). Most likely the context is not reaching the right section: check `compose()` in `compile.ts` against `dbg.ts` output.
3. "A new Chapter N / Title IV is added" (~160). These are chapter-level inserts. Map them to `add-sections` or exclude them from scoring with a stated reason.
4. "The lead-in language is amended …" (58). The gold part is likely `text` on the container. Align the signature.
5. "…striking the tabulation…" (40): tables, so exclude with a stated reason.

**Then, per the plan:** `apply.ts` (marked-segment tree with op provenance), `lint.ts`, word diff, Vitest tests, `scripts/benchmark.ts` (parse + replay against codified snapshots), `scripts/build-data.ts`, Preact UI per DESIGN.md and the surface brief, CI + post-deploy smoke on GitHub runners, docs, video, submission kit, HANDOFF.md.
