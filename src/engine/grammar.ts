/**
 * The grammar of D.C. amending instructions.
 *
 * D.C. bills use a small controlled language: a target ("Paragraph (2)", "Section 2
 * (D.C. Official Code § 38-501)") followed by one or more operations ("is amended by
 * striking the phrase 'X' and inserting the phrase 'Y' in its place"). This module turns
 * one instruction sentence into target references and operations. Quoted strings are
 * lifted out first, so the grammar only ever sees their placeholders.
 */
import type { Occurrence, Position } from './types';

export interface Quoted {
  /** Sentence with quoted strings replaced by ⟦0⟧, ⟦1⟧, ... */
  s: string;
  quotes: string[];
}

/**
 * Lift quoted strings out of an instruction. Handles curly and straight quotes, and
 * single-quoted strings nested inside double-quoted ones.
 */
export function liftQuotes(sentence: string): Quoted {
  const quotes: string[] = [];
  let s = '';
  let i = 0;
  while (i < sentence.length) {
    const ch = sentence[i]!;
    const isOpen = ch === '“' || (ch === '"' && (i === 0 || /[\s(\[—-]/.test(sentence[i - 1]!)));
    if (isOpen) {
      const closer = ch === '“' ? '”' : '"';
      // Find the matching closer: for curly quotes track nesting; for straight quotes take
      // the first straight quote that is followed by a non-word character.
      let j = i + 1;
      let depth = 1;
      let end = -1;
      while (j < sentence.length) {
        const c = sentence[j]!;
        if (ch === '“') {
          if (c === '“') depth++;
          else if (c === '”') {
            depth--;
            if (depth === 0) {
              end = j;
              break;
            }
          }
        } else if (c === closer && (j + 1 >= sentence.length || !/[\p{L}\p{N}]/u.test(sentence[j + 1]!))) {
          end = j;
          break;
        }
        j++;
      }
      if (end > i) {
        s += `⟦${quotes.length}⟧`;
        quotes.push(sentence.slice(i + 1, end));
        i = end + 1;
        continue;
      }
    }
    s += ch;
    i++;
  }
  return { s, quotes };
}

// ---------------------------------------------------------------------------------------
// Target references

/** Outline level of each kind of provision in D.C. drafting style. */
export const KIND_LEVEL: Record<string, number> = {
  subsection: 1,
  paragraph: 2,
  subparagraph: 3,
  'sub-subparagraph': 4,
  'sub-sub-subparagraph': 5,
  'sub-sub-sub-subparagraph': 6,
  clause: 4,
};

export interface PathStep {
  d: string;
  level: number;
}

export interface TargetRef {
  /** Explicit Code section, if the sentence names one. */
  section?: string;
  /** Path steps below the section (relative when no section is named). */
  steps: PathStep[];
  part?: 'heading' | 'lead-in' | 'num' | 'text';
  /** The sentence addresses a whole act or chapter ("§ 38-501 et seq."). */
  actWide?: boolean;
  /** Mentions of multiple targets ("Subsections (b) and (c)") expand to several refs. */
}

const DES = String.raw`\([A-Za-z0-9-]+\)`;
const DES_RUN = String.raw`(?:${DES})+`;

/** Level of a designation by its form (used for Code citations like § 38-501(a)(1)(A)). */
export function formLevel(d: string, prev?: number): number {
  const x = d.slice(1, -1);
  if (/^\d/.test(x)) return 2;
  if (/^[A-Z]+(?:-\d+)?$/.test(x)) return /^[IVXL]+$/.test(x) && prev !== undefined && prev >= 4 ? 5 : 3;
  if (/^[ivxl]+$/.test(x) && (x.length > 1 || (prev !== undefined && prev >= 3))) return 4;
  if (/^([a-z])\1+$/.test(x)) return 6;
  return 1;
}

export function stepsFromRun(run: string, firstLevel?: number): PathStep[] {
  const ds = run.match(new RegExp(DES, 'g')) ?? [];
  const out: PathStep[] = [];
  let prev: number | undefined = firstLevel !== undefined ? firstLevel - 1 : undefined;
  for (const [i, d] of ds.entries()) {
    const level = i === 0 && firstLevel !== undefined ? firstLevel : formLevel(d, prev);
    out.push({ d, level });
    prev = level;
  }
  return out;
}

/** Normalise a section number as written in a bill ("§ 42-3502.08", "section 29-910"). */
function cleanSection(s: string): string {
  return s.replace(/[‐‑‒–—]/g, '-').replace(/[.,;]+$/, '');
}

const CODE_CITE = new RegExp(
  String.raw`D\.\s?C\.\s+Official\s+Code\s+§§?\s*([0-9]+[A-Z]?[-:][0-9A-Za-z.:-]*?[0-9A-Za-z])((?:${DES})*)(\s+et\s+seq\.?)?(?=[\s,;)]|$)`,
  'i',
);

/**
 * Find the target the sentence's subject addresses. The subject is everything before the
 * main verb ("is amended", "are amended", "is repealed", ...).
 */
export function parseSubject(subject: string): TargetRef[] {
  const refs: TargetRef[] = [];
  const cite = CODE_CITE.exec(subject);
  const lower = subject.toLowerCase();
  let part: TargetRef['part'];
  if (/\b(?:section\s+)?heading\b/.test(lower) && !/\bheading of\b.*\b(?:subchapter|chapter|title|part)\b/.test(lower)) part = 'heading';
  if (/\b(?:lead-?in|introductory)\s+(?:language|text|clause|phrase|sentence)\b/.test(lower)) part = 'lead-in';

  if (cite) {
    const section = cleanSection(cite[1]!);
    const actWide = !!cite[3];
    const steps = cite[2] ? stepsFromRun(cite[2]) : [];
    // "Section 2(a) (D.C. Official Code § 38-501(a))": the Code citation is authoritative.
    refs.push({ section, steps, ...(part ? { part } : {}), ...(actWide ? { actWide } : {}) });
    return refs;
  }

  // "Section 29-910 of the District of Columbia Official Code" / "section 28:2-106"
  const bare = /\bsection\s+(\d+[A-Z]?[-:][0-9A-Za-z.:-]*[0-9A-Za-z])((?:\([A-Za-z0-9-]+\))*)/i.exec(subject);
  if (bare && (/official code/i.test(subject) || /[-:]/.test(bare[1]!))) {
    refs.push({ section: cleanSection(bare[1]!), steps: bare[2] ? stepsFromRun(bare[2]) : [], ...(part ? { part } : {}) });
    return refs;
  }

  // Relative references: "Subsection (b)(1)", "Paragraphs (4) and (5)", "Subparagraphs (A) through (C)"
  const kindRe = /\b(sub-sub-sub-subparagraphs?|sub-sub-subparagraphs?|sub-subparagraphs?|subparagraphs?|paragraphs?|subsections?|clauses?)\s+((?:\([A-Za-z0-9-]+\))+(?:(?:\s*,\s*|\s*,?\s+(?:and|or)\s+|\s+through\s+)(?:\([A-Za-z0-9-]+\))+)*)/gi;
  let m: RegExpExecArray | null;
  const found: TargetRef[] = [];
  while ((m = kindRe.exec(subject))) {
    const kind = m[1]!.toLowerCase().replace(/s$/, '');
    const level = KIND_LEVEL[kind] ?? 1;
    const list = m[2]!;
    const runs = list.split(/\s*,\s*(?:and|or)?\s*|\s+(?:and|or)\s+/).filter(Boolean);
    for (const run of runs) {
      const thr = /^(\S+)\s+through\s+(\S+)$/.exec(run);
      if (thr) {
        for (const d of expandRange(thr[1]!, thr[2]!)) found.push({ steps: [{ d, level }] });
      } else {
        found.push({ steps: stepsFromRun(run, level) });
      }
    }
  }
  if (found.length) {
    // "Paragraph (2) of subsection (b)": combine an inner and an outer reference.
    if (found.length === 2 && /\bof\s+(?:sub)?(?:section|paragraph|subparagraph)\b/i.test(subject) && found[1]!.steps[0]!.level < found[0]!.steps[0]!.level) {
      return [{ steps: [...found[1]!.steps, ...found[0]!.steps], ...(part ? { part } : {}) }];
    }
    return found.map((f) => ({ ...f, ...(part ? { part } : {}) }));
  }
  if (part) return [{ steps: [], part }];
  return [];
}

const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii', 'xiii', 'xiv', 'xv', 'xvi', 'xvii', 'xviii', 'xix', 'xx'];

export function expandRange(a: string, b: string): string[] {
  const x = a.slice(1, -1);
  const y = b.slice(1, -1);
  if (/^\d+$/.test(x) && /^\d+$/.test(y)) {
    const out: string[] = [];
    for (let i = Number(x); i <= Number(y) && out.length < 200; i++) out.push(`(${i})`);
    return out;
  }
  const lx = x.toLowerCase();
  const ly = y.toLowerCase();
  const ri = ROMAN.indexOf(lx);
  const rj = ROMAN.indexOf(ly);
  if (ri >= 0 && rj > ri && (lx.length > 1 || ly.length > 1)) {
    return ROMAN.slice(ri, rj + 1).map((r) => `(${x === lx ? r : r.toUpperCase()})`);
  }
  if (/^[a-zA-Z]$/.test(x) && /^[a-zA-Z]$/.test(y)) {
    const out: string[] = [];
    for (let c = x.charCodeAt(0); c <= y.charCodeAt(0); c++) out.push(`(${String.fromCharCode(c)})`);
    return out;
  }
  return [a, b];
}

// ---------------------------------------------------------------------------------------
// Operations

export type RawOp =
  | { type: 'strike-insert'; find: string; replace: string; occurrence: Occurrence }
  | { type: 'strike'; find: string; occurrence: Occurrence }
  | { type: 'insert-text'; text: string; where: 'after' | 'before'; anchor: string; occurrence: Occurrence }
  | { type: 'insert-text-edge'; text: string; where: 'end' | 'start' }
  | { type: 'read-as-follows' }
  | { type: 'repeal' }
  | { type: 'add-nodes'; designations: string[]; kindLevel?: number; afterHint?: string; inline?: string }
  | { type: 'redesignate'; from: string[]; to: string[] }
  | { type: 'unparsed'; clause: string };

const PUNCT: Record<string, string> = {
  period: '.',
  semicolon: ';',
  comma: ',',
  colon: ':',
  'question mark': '?',
  dash: '—',
  'closing quotation mark': '”',
  'quotation mark': '"',
  'closing parenthesis': ')',
  'opening parenthesis': '(',
};

const NOUN = String.raw`(?:phrases?|words?|figures?|numbers?|numerals?|dates?|terms?|text|sentences?|letters?|citations?|references?|amounts?|symbols?|designations?|years?|dollar amounts?|abbreviations?|characters?|language|clauses?|name|titles?|provisions?)`;

interface ObjParse {
  value: string;
  occurrence: Occurrence;
  isPunct: boolean;
  rest: string;
}

function occurrenceFrom(qual: string | undefined, fallback: Occurrence): Occurrence {
  if (!qual) return fallback;
  const q = qual.toLowerCase();
  if (/wherever|each (?:time|place)|every (?:time|place)|all places|each instance|everywhere|all occurrences|all instances/.test(q)) return { kind: 'all' };
  if (/both (?:times|places)/.test(q)) return { kind: 'count', n: 2 };
  const n = /(\w+) times it appears/.exec(q);
  if (n) {
    const words: Record<string, number> = { two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7 };
    if (words[n[1]!]) return { kind: 'count', n: words[n[1]!]! };
  }
  if (/(?:the )?first (?:time|place|instance)|the first time/.test(q)) return { kind: 'position', at: 'first' };
  if (/(?:the )?last (?:time|place|instance)|at the end|the last time/.test(q)) return { kind: 'position', at: 'last' };
  if (/at the beginning/.test(q)) return { kind: 'position', at: 'first' };
  return fallback;
}

const QUAL = String.raw`(?:\s*,?\s*(wherever (?:it|they) appears?|each (?:time|place) (?:it|they) appears?|every (?:time|place) (?:it|they) appears?|each place where it appears|both (?:times|places) (?:it|they) appears?|(?:two|three|four|five|six|seven) times it appears|the (?:first|last|second) (?:time|place|instance) (?:it|that it) appears|at the end(?: thereof| of the (?:sentence|paragraph|subparagraph|subsection|section|lead-in language))?|at the beginning(?: thereof)?|(?:in|from) the (?:first|last|second) sentence))?`;

/** Parse the object of "striking"/"inserting": a quoted phrase or a named punctuation mark. */
export function parseObject(s: string, quotes: string[], defaultOcc: Occurrence = { kind: 'one' }): ObjParse | null {
  const src = s.trimStart();
  let m = new RegExp(String.raw`^(?:the|a|an|each|new)?\s*(?:${NOUN}\s+)?⟦(\d+)⟧(?:\s+and\s+(?:the\s+)?(?:${NOUN}\s+)?⟦(\d+)⟧)?${QUAL}`, 'i').exec(src);
  if (m) {
    const value = quotes[Number(m[1])] ?? '';
    return { value, occurrence: occurrenceFrom(m[3], defaultOcc), isPunct: false, rest: src.slice(m[0].length) };
  }
  m = new RegExp(String.raw`^(?:the|a|an)\s+(${Object.keys(PUNCT).join('|')})${QUAL}`, 'i').exec(src);
  if (m) {
    const value = PUNCT[m[1]!.toLowerCase()]!;
    // "the period" means the terminal one unless the bill says otherwise.
    return { value, occurrence: occurrenceFrom(m[2], { kind: 'position', at: 'last' }), isPunct: true, rest: src.slice(m[0].length) };
  }
  return null;
}

/** Split a predicate into clauses at each new verb ("… and by striking …; and by adding …"). */
export function splitClauses(pred: string): string[] {
  return pred
    .split(/(?:\s*[;,]\s*(?:and\s+)?|\s+and\s+)(?=(?:by\s+)?(?:striking|inserting|adding|redesignating|designating)\b)/i)
    .map((c) => c.trim())
    .filter(Boolean);
}

const VERB_SPLIT = /\b(?:is|are|shall be)\s+(?:hereby\s+)?(amended|repealed|redesignated|added|designated|renumbered|revised)\b/i;

export interface ParsedSentence {
  refs: TargetRef[];
  ops: RawOp[];
  /** The sentence only establishes context for its children ("… is amended as follows:"). */
  contextOnly: boolean;
  /** The sentence is not an amending instruction at all (enacting clause, effective date, ...). */
  inert: boolean;
}

/** Imperative forms used in child provisions: "Strike …", "Insert …", "Add …". */
const IMPERATIVE = /^(strike|insert|add|redesignate|designate)\b/i;

export function parseInstruction(sentence: string): ParsedSentence {
  const { s, quotes } = liftQuotes(sentence.trim());
  const text = s.replace(/\s+/g, ' ').trim();
  const lower = text.toLowerCase();
  const result: ParsedSentence = { refs: [], ops: [], contextOnly: false, inert: false };

  // New provisions: "A new paragraph (9) is added to read as follows:" / "New paragraphs (9) and (10) are added …"
  const added = /^(?:an?\s+)?new\s+(sub-sub-subparagraphs?|sub-subparagraphs?|subparagraphs?|paragraphs?|subsections?|sections?|sentences?)\s*((?:\([A-Za-z0-9-]+\)|§\s*[0-9A-Z.:-]+)(?:(?:\s*,\s*|\s*,?\s*(?:and|through)\s+)(?:\([A-Za-z0-9-]+\)|§\s*[0-9A-Z.:-]+))*)?\s+(?:is|are)\s+(?:added|inserted)\b(.*)$/i.exec(text);
  if (added) {
    const kind = added[1]!.toLowerCase().replace(/s$/, '');
    const des = (added[2] ?? '').match(/\([A-Za-z0-9-]+\)|§\s*[0-9A-Z.:-]+/g) ?? [];
    const tail = added[3] ?? '';
    const afterHint = /\bafter\s+((?:sub)*(?:section|paragraph|subparagraph)\s+)?(\([A-Za-z0-9-]+\)|§\s*[0-9A-Z.:-]+)/i.exec(tail)?.[2];
    const inl = /⟦(\d+)⟧/.exec(tail);
    result.ops.push({
      type: 'add-nodes',
      designations: expandList(des),
      kindLevel: KIND_LEVEL[kind],
      ...(afterHint ? { afterHint } : {}),
      ...(inl && kind === 'sentence' ? { inline: quotes[Number(inl[1])]! } : {}),
    });
    const subj = /\b(?:to|in|of)\s+((?:sub)*(?:section|paragraph|subparagraph)s?\s+\(.*)$/i.exec(tail);
    if (subj) result.refs = parseSubject(subj[1]!);
    return result;
  }

  if (IMPERATIVE.test(text)) {
    result.ops.push(...parsePredicate(text, quotes));
    // "Strike the phrase X in subsection (b) and ..." — targets named inside the imperative
    const inRef = /\b(?:in|from|of)\s+((?:sub-)*(?:sub)?(?:section|paragraph|subparagraph)s?\s+\([A-Za-z0-9-]+\)(?:\([A-Za-z0-9-]+\))*)/i.exec(text);
    if (inRef) result.refs = parseSubject(inRef[1]!);
    return result;
  }

  const vm = VERB_SPLIT.exec(text);
  if (!vm) {
    result.inert = true;
    return result;
  }
  const subject = text.slice(0, vm.index);
  const verb = vm[1]!.toLowerCase();
  const pred = text.slice(vm.index + vm[0].length).trim();
  result.refs = parseSubject(subject);

  if (verb === 'repealed') {
    result.ops.push({ type: 'repeal' });
    return result;
  }
  if (verb === 'redesignated' || verb === 'renumbered' || verb === 'designated') {
    const to = /^as\s+(?:(?:sub-)*(?:sub)?(?:section|paragraph|subparagraph)s?\s+)?(.+?)(?:,\s*respectively)?[.;:]?$/i.exec(pred);
    const from = result.refs.flatMap((r) => r.steps.map((st) => st.d));
    if (to && from.length) {
      const toList = expandList(to[1]!.match(/\([A-Za-z0-9-]+\)/g) ?? []);
      result.ops.push({ type: 'redesignate', from, to: toList });
      // The redesignated provisions are the objects, not the target: their parent is the target.
      result.refs = result.refs.length ? [{ ...result.refs[0]!, steps: result.refs[0]!.steps.slice(0, -1) }] : [];
      return result;
    }
    result.ops.push({ type: 'unparsed', clause: text });
    return result;
  }
  if (verb === 'added') {
    // "Subsection (f) is added to read as follows:" — treated as new provisions
    const des = result.refs.flatMap((r) => r.steps.slice(-1).map((st) => st.d));
    const lvl = result.refs[0]?.steps.slice(-1)[0]?.level;
    result.refs = result.refs.length ? [{ ...result.refs[0]!, steps: result.refs[0]!.steps.slice(0, -1) }] : [];
    result.ops.push({ type: 'add-nodes', designations: des, ...(lvl ? { kindLevel: lvl } : {}) });
    return result;
  }

  // "is amended ..."
  if (/^as follows:?\s*$/i.test(pred) || /^(?:in|to)\s+.*\bas follows:?\s*$/i.test(pred) && !/read as follows/i.test(pred)) {
    result.contextOnly = true;
    return result;
  }
  if (/^to read as follows:?\s*$/i.test(pred) || /^(?:in its entirety )?to read as follows/i.test(pred)) {
    result.ops.push({ type: 'read-as-follows' });
    return result;
  }
  const ops = parsePredicate(pred, quotes);
  result.ops.push(...ops);
  if (!ops.length) result.ops.push({ type: 'unparsed', clause: text });
  void lower;
  return result;
}

export function expandList(ds: string[]): string[] {
  return ds.map((d) => d.replace(/\s+/g, ' '));
}

/** Parse the operations of a predicate ("by striking … and inserting … in its place; and by adding …"). */
export function parsePredicate(pred: string, quotes: string[]): RawOp[] {
  const ops: RawOp[] = [];
  for (let clause of splitClauses(pred)) {
    clause = clause.replace(/^by\s+/i, '').replace(/[.;:]\s*(?:and|or)?\s*$/i, '').trim();
    const lc = clause.toLowerCase();

    // striking … [and inserting … in its place]
    let m = /^strik(?:e|ing)\s+(?:out\s+)?(.*)$/i.exec(clause);
    if (m) {
      const obj = parseObject(m[1]!, quotes);
      if (!obj) {
        ops.push({ type: 'unparsed', clause });
        continue;
      }
      const rest = obj.rest.trim();
      const ins = /^,?\s*and\s+(?:by\s+)?insert(?:ing)?\s+(?:in (?:its|their) place\s+)?(.*?)\s*(?:in (?:its|their) place|in lieu thereof)?\s*$/i.exec(rest);
      if (ins) {
        const rep = parseObject(ins[1]!.replace(/\s*in (?:its|their) place\s*$/i, ''), quotes);
        if (rep) {
          ops.push({ type: 'strike-insert', find: obj.value, replace: rep.value, occurrence: obj.occurrence });
          continue;
        }
        ops.push({ type: 'unparsed', clause });
        continue;
      }
      if (!rest || /^(?:from|in)\s/i.test(rest)) {
        ops.push({ type: 'strike', find: obj.value, occurrence: obj.occurrence });
        continue;
      }
      ops.push({ type: 'unparsed', clause });
      continue;
    }

    // inserting X after/before Y | at the end | at the beginning
    m = /^insert(?:ing)?\s+(.*)$/i.exec(clause);
    if (m) {
      const obj = parseObject(m[1]!, quotes);
      if (!obj) {
        ops.push({ type: 'unparsed', clause });
        continue;
      }
      const rest = obj.rest.trim();
      const rel = /^(?:immediately\s+)?(after|before|following|preceding)\s+(.*)$/i.exec(rest);
      if (rel) {
        const anchor = parseObject(rel[2]!, quotes);
        if (anchor) {
          ops.push({
            type: 'insert-text',
            text: obj.value,
            where: /after|following/i.test(rel[1]!) ? 'after' : 'before',
            anchor: anchor.value,
            occurrence: anchor.occurrence,
          });
          continue;
        }
      }
      if (/^at the end\b/i.test(rest) || obj.occurrence.kind === 'position' && obj.occurrence.at === 'last' && /at the end/i.test(m[1]!)) {
        ops.push({ type: 'insert-text-edge', text: obj.value, where: 'end' });
        continue;
      }
      if (/^at the beginning\b/i.test(rest)) {
        ops.push({ type: 'insert-text-edge', text: obj.value, where: 'start' });
        continue;
      }
      ops.push({ type: 'unparsed', clause });
      continue;
    }

    // adding a new paragraph (3) to read as follows: | adding X at the end | adding a new sentence at the end to read as follows: “…”
    m = /^add(?:ing)?\s+(.*)$/i.exec(clause);
    if (m) {
      const body = m[1]!;
      const sentence = /^(?:a\s+)?new\s+sentences?\s+at the (end|beginning)(?:\s+(?:thereof|of\s+[^⟦]*?))?\s+to read as follows:?\s*⟦(\d+)⟧/i.exec(body);
      if (sentence) {
        ops.push({ type: 'insert-text-edge', text: quotes[Number(sentence[2])]!, where: sentence[1]!.toLowerCase() === 'end' ? 'end' : 'start' });
        continue;
      }
      const nn = /^(?:an?\s+)?new\s+(sub-sub-subparagraphs?|sub-subparagraphs?|subparagraphs?|paragraphs?|subsections?|sections?)\s*((?:\([A-Za-z0-9-]+\)|§\s*[0-9A-Z.:-]+)(?:(?:\s*,\s*|\s*,?\s*(?:and|through)\s+)(?:\([A-Za-z0-9-]+\)|§\s*[0-9A-Z.:-]+))*)?(.*)$/i.exec(body);
      if (nn) {
        const kind = nn[1]!.toLowerCase().replace(/s$/, '');
        const des = (nn[2] ?? '').match(/\([A-Za-z0-9-]+\)|§\s*[0-9A-Z.:-]+/g) ?? [];
        const afterHint = /\bafter\s+(?:(?:sub-)*(?:sub)?(?:section|paragraph|subparagraph)\s+)?(\([A-Za-z0-9-]+\)|§\s*[0-9A-Z.:-]+)/i.exec(nn[3] ?? '')?.[1];
        ops.push({ type: 'add-nodes', designations: expandList(des), kindLevel: KIND_LEVEL[kind], ...(afterHint ? { afterHint } : {}) });
        continue;
      }
      const obj = parseObject(body, quotes);
      if (obj && /at the end|^$/i.test(obj.rest.trim() || 'at the end')) {
        ops.push({ type: 'insert-text-edge', text: obj.value, where: 'end' });
        continue;
      }
      ops.push({ type: 'unparsed', clause });
      continue;
    }

    // redesignating paragraphs (4) and (5) as paragraphs (5) and (6)
    m = /^(?:re)?designating\s+(.*?)\s+as\s+(.*)$/i.exec(clause);
    if (m) {
      const from = m[1]!.match(/\([A-Za-z0-9-]+\)/g) ?? [];
      const to = m[2]!.match(/\([A-Za-z0-9-]+\)/g) ?? [];
      if (from.length && from.length === to.length) {
        ops.push({ type: 'redesignate', from, to });
        continue;
      }
    }
    if (lc) ops.push({ type: 'unparsed', clause });
  }
  return ops;
}

export type { Position };
