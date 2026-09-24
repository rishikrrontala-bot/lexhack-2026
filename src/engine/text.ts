/**
 * Text utilities shared by the parser and the edit engine.
 *
 * Legal text arrives with a mix of straight and curly quotation marks, non-breaking
 * spaces and PDF line-break artifacts. Matching must be tolerant of those differences
 * while edits must stay literal: the Council's codifiers apply strikes character for
 * character, so this module never "tidies" the text it edits.
 */

/** Map every quotation-mark variant to a canonical straight form (for comparison only). */
export function foldQuotes(s: string): string {
  return s.replace(/[“”„‟″]/g, '"').replace(/[‘’‚‛′]/g, "'");
}

/** Canonical form used to compare two pieces of legal text for equality. */
export function canon(s: string): string {
  return foldQuotes(s)
    .replace(/[   ]/g, ' ')
    .replace(/[‐‑‒–—]/g, (m) => (m === '—' ? '—' : '-'))
    .replace(/\s+/g, ' ')
    .trim();
}

/** Collapse runs of whitespace (used for display and for building paragraphs). */
export function squash(s: string): string {
  return s.replace(/[   ]/g, ' ').replace(/\s+/g, ' ').trim();
}

const WORDISH = /[\p{L}\p{N}]/u;

/**
 * A character-level mapping between a string and its quote-folded, whitespace-tolerant
 * search form, so a match found in the folded form can be mapped back to exact offsets.
 */
interface Folded {
  text: string;
  /** For each index in `text`, the index in the original string. */
  map: number[];
}

function fold(s: string): Folded {
  let text = '';
  const map: number[] = [];
  let prevSpace = false;
  for (let i = 0; i < s.length; i++) {
    let ch = s[i]!;
    if (/[   \s]/.test(ch)) {
      if (prevSpace) continue;
      ch = ' ';
      prevSpace = true;
    } else {
      prevSpace = false;
      ch = foldQuotes(ch);
      if (/[‐‑‒–]/.test(ch)) ch = '-';
    }
    text += ch;
    map.push(i);
  }
  return { text, map };
}

export interface Match {
  start: number;
  end: number;
}

/**
 * Find every occurrence of `needle` in `hay`, tolerant of quote style and whitespace runs.
 * When the needle starts or ends with a word character, the match must not be glued to
 * another word character (so striking "and" never hits "band").
 */
export function findAll(hay: string, needle: string): Match[] {
  const n = fold(needle.trim());
  if (!n.text) return [];
  const h = fold(hay);
  const out: Match[] = [];
  const firstWordy = WORDISH.test(n.text[0]!);
  const lastWordy = WORDISH.test(n.text[n.text.length - 1]!);
  let from = 0;
  for (;;) {
    const idx = h.text.indexOf(n.text, from);
    if (idx < 0) break;
    const endIdx = idx + n.text.length; // exclusive, in folded coords
    const before = idx > 0 ? h.text[idx - 1]! : '';
    const after = endIdx < h.text.length ? h.text[endIdx]! : '';
    const okBefore = !firstWordy || !before || !WORDISH.test(before);
    const okAfter = !lastWordy || !after || !WORDISH.test(after);
    if (okBefore && okAfter) {
      const start = h.map[idx]!;
      const lastOrig = h.map[endIdx - 1]!;
      out.push({ start, end: lastOrig + 1 });
      from = endIdx;
    } else {
      from = idx + 1;
    }
  }
  return out;
}

/** Straight-quote a phrase for display inside UI copy. */
export function q(s: string): string {
  return `“${s}”`;
}

/** Truncate for UI labels without cutting a word in half. */
export function clip(s: string, max = 80): string {
  const t = squash(s);
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const sp = cut.lastIndexOf(' ');
  return `${cut.slice(0, sp > max * 0.6 ? sp : max).trimEnd()}…`;
}

/** Split text into word and non-word tokens, keeping whitespace attached as its own tokens. */
export function tokenize(s: string): string[] {
  return s.match(/[\p{L}\p{N}’'§.-]+|\s+|[^\s\p{L}\p{N}]/gu) ?? [];
}
