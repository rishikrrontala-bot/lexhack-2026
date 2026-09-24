---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface brief: Compile (the tool page, `/`)

Scope: the single-page tool (Compile, Replay, Accuracy, How it works share one world). Visitor mode: **Operate** (the first viewport also carries the judge's Persuade job by demonstrating the mechanism, never by marketing copy).
Audience/job: a D.C. resident, advocate, reporter or drafter holding a bill; a LexHack judge with 2 minutes. Action: read the law a bill would make; trust it because every change is traced and verified.
Memorable moment: the Code section getting marked up by the bill, mark by mark, then snapping to the clean revised text.
Unresolved: dark theme (not planned for v1; the scene is document-reading in ordinary room light).

## Direction contract
THESIS: The bill is the author's markup and the D.C. Code is the galley. This surface is the proof desk where the two meet. It refuses the category default of a chat box or a GitHub-style red/green diff.
OWN-WORLD: The prepress proof room in four process roles. White proof galleys sit on a pale cyan light-table grid. **Cyan** (non-photo blue) draws structure, rules, line numbers, crop marks and the trace. **Magenta** is the proofreader's pencil: authored SVG strike lines, delete loops, carets, inserted text. **Yellow** is the query flag for anything that needs a human. **Black** is the law's ink. Law text is set in Charis SIL (Bitstream Charter, the legal-briefs face) and the UI in Public Sans (the U.S. Web Design System face). The wordmark is "In ‸ Place" with "Its" inserted by a caret.
STORY: Instantly understand that bills are edit scripts, see a real D.C. law rewrite a real Code section, believe it because the margin traces each change to its sentence and a stamp confirms it matches the Council's published text, then paste your own.
FIRST VIEWPORT: Top left, a two-line thesis h1 (≈40px) with a one-line subhead and the jurisdiction chip. Below it the proof desk fills the width: left 38% is "The bill" manuscript with cyan line numbers, and each instruction is a focusable block. Right 62% is the galley of the targeted Code section with crop marks, a slug line and a margin gutter of mark references. A Marked/Clean segmented toggle and a verification stamp sit on the galley's header. The primary action ("Compile your own bill") is a button at the head of the bill column. Example chips (real laws) sit under the h1.
FORM: prepress galley proof + proofreader's marks, candidate 3 of 7 (ranked list: bill paper · track-changes balloons · **galley proof** · D.C. Register · WMATA wayfinding · codifier index cards · D.C. flag identity). Seed key 8717fc72 (degraded roll: roll service unreachable, no challengers).
Signature interaction: the markup draws itself down the galley on compile. Strike lines and carets are stroked with a 40 ms stagger and a 280 ms ease-out per mark, ≤1.2 s total. Hovering or focusing an instruction lights its marks (and back). Marked → Clean resolves the marks into the revised proof. Under reduced motion everything is drawn at once.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
