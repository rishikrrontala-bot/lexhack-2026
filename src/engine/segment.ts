/**
 * Segment raw bill text into provisions (the bill's own outline) and quoted blocks
 * (new text the bill puts into the Code).
 *
 * Handles text copied from the Council's enrolled-act PDFs (line numbers, page headers,
 * hyphenated line breaks, hard-wrapped lines) as well as clean text.
 */
import type { Provision, QuotedBlock } from './types';
import { squash } from './text';

const OPEN_Q = /^[“"]/;
/** An enumerator such as (a), (1), (A), (iv), (2A), (aa), (b-1). */
const ENUM = String.raw`\[?\((?:[a-z]{1,4}|[A-Z]{1,4}|\d{1,3}[A-Za-z]{0,2}(?:-\d+)?|[a-z]{1,3}-\d+|[A-Z]{1,2}-(?:\d+|[ivx]+))\)\]?`;
const LEAD_ENUMS = new RegExp(String.raw`^((?:${ENUM})+)\s*`);
const SEC = /^Sec(?:tion)?\.?\s*(\d+[a-z]?)\.\s*/i;
const PARA_START = new RegExp(String.raw`^(?:[“"]\s*)?(?:${ENUM}|§\s*\d|Sec(?:tion)?\.?\s*\d+[a-z]?\.|BE IT ENACTED|AN ACT\b|TITLE\s+[IVX\d]+)`, 'i');

/** Lines that are PDF furniture, not bill text. */
const FURNITURE = [
  /^\s*ENROLLED ORIGINAL\s*$/i,
  /^\s*\d{1,3}\s*$/, // bare page numbers
  /^\s*Page\s+\d+\s+of\s+\d+\s*$/i,
  /^\s*Codification District of Columbia Official Code.*$/i,
  /^\s*Council of the District of Columbia\s*$/i,
];

/** Remove leading line numbers when most lines carry them (enrolled-act PDFs number every line). */
function stripLineNumbers(lines: string[]): string[] {
  const numbered = lines.filter((l) => /^\s*\d{1,3}\s+\S/.test(l)).length;
  const nonEmpty = lines.filter((l) => l.trim()).length;
  if (nonEmpty === 0 || numbered / nonEmpty < 0.5) return lines;
  return lines.map((l) => l.replace(/^\s*\d{1,3}\s+/, ''));
}

/** Join hard-wrapped lines into paragraphs. */
export function toParagraphs(raw: string): string[] {
  let lines = raw.replace(/\r\n?/g, '\n').split('\n');
  lines = stripLineNumbers(lines).filter((l) => !FURNITURE.some((re) => re.test(l)));
  const paras: string[] = [];
  let cur = '';
  const endsSentence = (s: string) => /[.:;”"]\s*$|[.;]\s*[”"]\s*[.;,]?\s*$|\band\s*$|\bor\s*$/.test(s);
  for (const rawLine of lines) {
    const line = rawLine.replace(/\t/g, ' ').trim();
    if (!line) {
      if (cur) paras.push(cur);
      cur = '';
      continue;
    }
    const starts = PARA_START.test(line);
    if (cur && starts && endsSentence(cur)) {
      paras.push(cur);
      cur = line;
    } else if (!cur) {
      cur = line;
    } else if (/[A-Za-z]-$/.test(cur) && /^[a-z]/.test(line)) {
      cur = cur.slice(0, -1) + line; // re-join a hyphenated word
    } else {
      cur = `${cur} ${line}`;
    }
  }
  if (cur) paras.push(cur);
  return paras.map(squash).filter(Boolean);
}

/** Outline level of a designation, used to rebuild the bill's own hierarchy. */
function levelOf(d: string, stackLevels: number[]): number {
  const inner = d.slice(1, -1);
  if (/^\d/.test(inner)) return 2;
  if (/^[A-Z]{1,4}$/.test(inner)) {
    if (/^[IVXL]+$/.test(inner) && stackLevels.includes(4)) return 5;
    return 3;
  }
  if (/^[ivxl]+$/.test(inner)) {
    // "(i)" can be a letter (after "(h)") or a roman numeral (under "(A)").
    if (inner.length > 1 || stackLevels.some((l) => l >= 3)) return 4;
    return 1;
  }
  if (/^[a-z]{2,}$/.test(inner) && inner[0] === inner[1]) return 6; // (aa)
  return 1;
}

const closesQuote = (s: string) => /[”"]\s*[.;,:)]*\s*(?:and|or)?\s*$/.test(s);

/**
 * Split a quoted paragraph from its closing punctuation: “(2) Text.”. → text "(2) Text.", after ".".
 */
function unquote(s: string): { body: string; closed: boolean; after: string } {
  let body = s.replace(OPEN_Q, '').trim();
  const m = /[”"]\s*([.;,:]*\s*(?:and|or)?)\s*$/.exec(body);
  if (m && closesQuote(body)) {
    body = body.slice(0, m.index).trim();
    return { body, closed: true, after: m[1]!.trim() };
  }
  return { body, closed: false, after: '' };
}

function splitNums(body: string): { nums: string[]; text: string } {
  const sec = /^§\s*([\dA-Za-z:.-]+?)\.\s+/.exec(body);
  if (sec) return { nums: [`§ ${sec[1]}`], text: body.slice(sec[0].length) };
  const act = /^Sec(?:tion)?\.\s*(\d+[a-zA-Z]{0,3}(?:-\d+)?)\.\s*/.exec(body);
  if (act) return { nums: [`Sec. ${act[1]}`], text: body.slice(act[0].length) };
  const m = LEAD_ENUMS.exec(body);
  if (!m) return { nums: [], text: body };
  return { nums: (m[1]!.match(new RegExp(ENUM, 'g')) ?? []).map((d) => d.replace(/[\[\]]/g, '')), text: body.slice(m[0].length) };
}

/** Does this provision introduce quoted material (new text) rather than child provisions? */
export function introducesQuote(text: string): boolean {
  const t = text.toLowerCase();
  if (!/as follows:\s*$/.test(t)) return false;
  return /to read as follows:\s*$/.test(t) || /\b(?:added|adding|inserted|inserting|amended)\b[^:]*\bread as follows:\s*$/.test(t);
}

export interface Segmented {
  provisions: Provision[];
  /** "may be cited as the ..." */
  shortTitle?: string;
}

export function segment(raw: string): Segmented {
  const paras = toParagraphs(raw);
  const provisions: Provision[] = [];
  let shortTitle: string | undefined;
  // Stack of open provisions: [level, provisionIndex]
  let stack: { level: number; index: number; label: string }[] = [];
  let openQuote: { block: QuotedBlock; owner: Provision } | null = null;

  for (const p of paras) {
    const st = /may be cited as the [“"]([^”"]+)[”"]/i.exec(p);
    if (st && !shortTitle) shortTitle = st[1];

    if (openQuote || (OPEN_Q.test(p) && provisions.length && introducesQuote(provisions[provisions.length - 1]!.text) && !provisions[provisions.length - 1]!.quoted)) {
      if (!openQuote) {
        const owner = provisions[provisions.length - 1]!;
        openQuote = { block: { paragraphs: [], after: '' }, owner };
        owner.quoted = openQuote.block;
      }
      const u = unquote(p);
      const { nums, text } = splitNums(u.body);
      openQuote.block.paragraphs.push({ nums, text });
      if (u.closed) {
        openQuote.block.after = u.after;
        openQuote = null;
      }
      continue;
    }

    const sec = SEC.exec(p);
    let nums: string[] = [];
    let text = p;
    let level = 0;
    if (sec) {
      nums = [`Sec. ${sec[1]}.`];
      text = p.slice(sec[0].length);
      level = 0;
    } else {
      const s = splitNums(p);
      nums = s.nums;
      text = s.text;
      if (!nums.length) {
        // Enacting clause or an unnumbered paragraph: attach to the outline root.
        provisions.push({ index: provisions.length, nums: [], text, depth: 0, label: '', parent: -1 });
        continue;
      }
      level = levelOf(nums[nums.length - 1]!, stack.map((s) => s.level));
    }
    stack = stack.filter((s) => s.level < level);
    const parent = stack.length ? stack[stack.length - 1]! : null;
    const labelBase = parent ? parent.label : '';
    const own = nums.join('');
    const label = sec ? `Sec. ${sec[1]}` : labelBase ? `${labelBase}${own}` : own;
    const prov: Provision = { index: provisions.length, nums, text, depth: stack.length, label, parent: parent ? parent.index : -1 };
    provisions.push(prov);
    stack.push({ level, index: prov.index, label });
  }
  return { provisions, ...(shortTitle ? { shortTitle } : {}) };
}
