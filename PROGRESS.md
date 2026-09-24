# PROGRESS: LexHack 2026 (Rishik Rontala)

**Deadline:** Sun Sep 27, 2026 · 5:00 PM EDT (`2026-09-27T17:00:00-04:00`)
**Internal "all deliverables done" target:** Sat Sep 26, 2026 · 5:00 PM EDT (≥24 h early, per CLAUDE.md lesson 2)
**Live URL:** https://rishikrrontala-bot.github.io/lexhack-2026/ · **Branch:** `claude/optimistic-mayer-9qzmqa` → `main`

## Countdown log
| Phase start (ET) | Hours to deadline | Hours to internal target |
|---|---|---|
| Wed Sep 23 · 10:32 PM (Phase 0) | 90.5 | 66.5 |

## Phase plan (budgeted backwards, hackathon-win Phase 4 table, over the 66.5 h to the internal target)
| # | Phase | Budget | Target finish (ET) | Status |
|---|---|---|---|---|
| 0 | Countdown + tool check | 0.5 h | Wed 11:00 PM | done |
| 1–2 | Research: verify event facts, 5–8 winner briefs, RESEARCH-BRIEF | 4 h | Thu 3:00 AM | in progress |
| 3 | Concepts ×3 scored, pick, CONCEPT.md pushed | 1 h | Thu 4:00 AM | |
| 4 | Design direction: PRODUCT.md + DESIGN.md | 1.5 h | Thu 5:30 AM | |
| 5 | Core build (~50%): wow moment → demo path → rest, tests, CI, deploy | 26 h | Fri 7:30 AM | |
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
