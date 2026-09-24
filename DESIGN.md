# Design: In Its Place

> Status: **direction set before the build** (Wed Sep 23). Per impeccable, this file is rewritten from the *built* world at the finish review, so treat the tokens below as the contract the build implements. The direction contract itself lives in `.impeccable/surfaces/index-html.md`.

## World: the proof desk
A bill is an author's markup and the D.C. Code is the galley it marks up. The interface is the prepress proof room where the two meet: white galley strips on a pale cyan light-table grid, a proofreader's pencil working down the text, yellow query flags where a human has to decide, and an **OK** when the proof matches the published text.

It deliberately refuses:
- a chat box ("AI legal assistant");
- a developer red/green diff;
- cream paper + serif display + terracotta, the calibration default;
- Rishik's portfolio vocabulary (bone/ink/terra, Archivo).

## Color: four process roles (CMYK)
Strategy: **Restrained product surface with committed roles.** Each process color has exactly one job, and none is decoration.

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `--paper` | `#FCFCFA` | Galley paper (never cream) | ground |
| `--board` | `#E7EFF1` | Light-table ground behind the galleys | ground |
| `--grid` | `#CFE6EE` | Light-table grid, decorative only | n/a |
| `--ink` | `#141517` | **K**: the law's text, primary UI text | 17.8:1 on paper |
| `--ink-2` | `#4B5257` | Secondary text | 7.7:1 on paper |
| `--cyan-line` | `#6FC3DD` | Non-photo blue rules, crop marks, grid accents (decorative) | n/a |
| `--cyan` | `#0A6680` | **C**: structure. Line numbers, labels, links, the trace | 6.3:1 on paper |
| `--cyan-deep` | `#074B5F` | Focus rings, active states | 9.4:1 on paper |
| `--trace` | `#D8F0F7` | Background of a traced (hovered/focused) instruction ↔ change | ink 15.4:1 on it |
| `--magenta` | `#B5135F` | **M**: the proofreader's pencil. Strike lines, carets, inserted text | 6.3:1 on paper |
| `--magenta-deep` | `#8E0C4A` | Pressed/active pencil states | 8.9:1 on paper |
| `--flag` | `#FFE15C` | **Y**: query flag. Anything that needs a human, with ink text | ink 14.1:1 on it |

Meaning never rides on color alone. Deletions use `<del>` + strikethrough + an accessible label. Insertions use `<ins>` + underline. Queries carry a "Qy" glyph and text.

## Type
- **Law text: Charis SIL** (SIL OFL, derived from Bitstream Charter, the face *Typography for Lawyers* recommends for court filings). It's the galley's body face at 18/1.6 on desktop and 16.5/1.55 on phone, with a 68ch measure.
- **UI: Public Sans (variable)** (SIL OFL, the U.S. Web Design System's typeface). Used for labels, controls, headings and data, with `font-variant-numeric: tabular-nums` for counts, line numbers and § references.
- **Wordmark:** "In ‸ Place". "Its" is inserted above a magenta caret, so the logo is the mechanism.
- Scale (fixed rem, ratio ~1.2): 12 · 13.5 · 15 · 16.5 (base UI) · 18 (law body) · 21.5 · 26 · 31 · 40 (h1 only). Tracking is never below −0.02em. Headings are balanced (`text-wrap: balance`).
- No monospace, which would be a costume. Section numbers and counts are tabular Public Sans.

## Marks (authored SVG, not glyphs)
- **Strike:** a hand-weighted magenta line through the struck run (2px, round caps, a slight 0.5px wobble baked into the path), plus a dele loop in the margin gutter.
- **Insert:** a magenta caret ‸ at the insertion point. The inserted text is set in Charis SIL, colored magenta and underlined with a 1.5px magenta rule.
- **Replace block / new paragraph:** a magenta bracket in the gutter spanning the block.
- **Query:** a yellow flag in the gutter with "Qy" and the reason, which expands inline.
- **OK stamp:** a boxed "OK" set in Public Sans 700, with the publication date, in cyan-deep. Shown only when a replay matches the Council's published text.

## Layout
- Desktop: a header bar, then the thesis h1 and example chips, then the proof desk. The bill column is 38%; the galley is 62%, with a 44px margin gutter for marks on the galley's left. The galley has crop marks at its corners and a slug line above ("GALLEY · § 38-501 · D.C. Code as of … · marked for D.C. Law 25-108").
- Phone (≤ 720px): one column, bill instructions first as a compact list, the galley below. Tapping an instruction scrolls to its marks. The gutter narrows to 28px.
- Spacing scale: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 72. More space above a heading than below.
- Depth: galleys carry a real paper shadow (`0 1px 2px rgb(20 21 23 / .06), 0 8px 24px -12px rgb(20 21 23 / .18)`). No cards-in-cards, no glass, no gradients.

## Motion
One authored moment: **the markup draws itself** after a compile. Each mark is stroked via `stroke-dashoffset` over 280ms with `cubic-bezier(0.23, 1, 0.32, 1)`, staggered 40ms down the galley and capped at 1.2s total. Inserted text fades from 0 to 1 opacity over 200ms ease-out behind its caret.
The trace highlight (hover/focus) uses a 150ms `background-color` transition. The Marked ↔ Clean toggle crossfades over 180ms. Under `prefers-reduced-motion`, marks are fully drawn with no stroke animation and only opacity is kept. Hover effects are gated to `(hover: hover) and (pointer: fine)`.

## Browser surfaces
Text selection uses `--trace` with ink. The caret color is magenta. Focus rings are a 2px `--cyan-deep` outline at 2px offset. Scrollbars are thin, with a cyan-line thumb on the board. Link underlines sit at a 0.18em offset with a 1px thickness.

## Credit
The footer reads "Built by Rishik Rontala" in Public Sans at 13.5px `--ink-2`, beside the "not legal advice / not an official publication" line.
