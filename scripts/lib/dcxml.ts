/**
 * Readers for the Council of the District of Columbia's published XML
 * (https://github.com/DCCouncil/law-xml and https://github.com/DCCouncil/law-xml-codified).
 *
 * Node-only (build and benchmark scripts). The browser never parses XML: it receives the
 * JSON these functions produce.
 */
import { parseDocument } from 'htmlparser2';
import type { AnyNode, Element } from 'domhandler';
import type { CodeNode, CodeSection } from '../../src/engine/types';

const isEl = (n: AnyNode | null | undefined): n is Element => !!n && (n as Element).type === 'tag';
const kids = (e: Element): Element[] => e.children.filter(isEl);
const child = (e: Element, name: string): Element | undefined => kids(e).find((c) => c.name === name);

/** Inline text of an element: cites, emphasis and line breaks flattened; comments dropped. */
export function inline(e: Element | undefined): string {
  if (!e) return '';
  let s = '';
  const walk = (n: AnyNode) => {
    if (n.type === 'text') s += (n as unknown as { data: string }).data;
    else if (isEl(n)) {
      if (n.name === 'br') s += ' ';
      else if (n.name.startsWith('codify:') || n.name === 'annotations' || n.name === 'annotation') return;
      else for (const c of n.children) walk(c);
    }
  };
  for (const c of e.children) walk(c);
  return s.replace(/\s+/g, ' ').trim();
}

function tableText(t: Element): string {
  const rows: string[] = [];
  const walk = (n: Element) => {
    if (n.name === 'tr') rows.push(kids(n).map((c) => inline(c)).join(' | '));
    else kids(n).forEach(walk);
  };
  walk(t);
  return rows.join('\n');
}

/** Convert a <section>/<para> element of the Code into a CodeNode. */
export function toCodeNode(e: Element): CodeNode {
  const node: CodeNode = { children: [] };
  const num = child(e, 'num');
  if (num) node.num = inline(num);
  const heading = child(e, 'heading');
  if (heading) node.heading = inline(heading);
  const texts: string[] = [];
  for (const c of kids(e)) {
    if (c.name === 'text' && node.children.length === 0) texts.push(inline(c));
    else if (c.name === 'para' || c.name === 'section' || c.name === 'include') {
      if (c.name === 'include') for (const cc of kids(c)) node.children.push(toCodeNode(cc));
      else node.children.push(toCodeNode(c));
    } else if (c.name === 'text') {
      // Text after children in a mixed container: keep as an unnumbered block.
      node.children.push({ text: inline(c), children: [] });
    } else if (c.name === 'table') {
      node.children.push({ text: tableText(c), children: [] });
    } else if (c.name === 'aftertext') node.aftertext = inline(c);
  }
  if (texts.length) node.text = texts.join(' ');
  if (e.attribs.placeholder) node.placeholder = e.attribs.placeholder;
  return node;
}

export function parseXml(xml: string) {
  return parseDocument(xml, { xmlMode: true });
}

/** Read a Code section file into a CodeSection. */
export function codeSectionFromXml(xml: string): CodeSection {
  const doc = parseXml(xml);
  const root = doc.children.find((n): n is Element => isEl(n) && n.name === 'section');
  if (!root) throw new Error('no <section> root');
  const node = toCodeNode(root) as CodeSection;
  node.num = node.num ?? '';
  node.title = (/^(\d+[A-Z]?)[-:]/.exec(node.num)?.[1] ?? node.num.split(/[-:]/)[0]) || '';
  return node;
}

/** The laws that changed a section, from its History annotations (in codification order). */
export function historyDocs(xml: string): string[] {
  const out: string[] = [];
  for (const m of xml.matchAll(/<annotation\b[^>]*\btype="History"[^>]*>/g)) {
    const d = /\bdoc="([^"]+)"/.exec(m[0]);
    if (d && !out.includes(d[1]!)) out.push(d[1]!);
  }
  return out;
}

// ---------------------------------------------------------------------------------------
// Laws

export interface GoldOp {
  kind: 'find-replace' | 'insert' | 'replace' | 'repeal' | 'redesignate-para';
  /** Absolute codify path chain, joined with "|", e.g. "38|5|§38-501|(2)". */
  chain: string;
  section: string | null;
  path: string[];
  part?: 'heading' | 'text' | 'num';
  find?: string;
  replace?: string;
  count?: number;
  position?: string;
  after?: string;
  numValue?: string;
  /** Text of the provision(s) a replace/insert supplies. */
  newText?: string;
  /** Index (in document order) of the law provision the op belongs to. */
  provision: number;
  /** Instruction text of that provision. */
  instruction: string;
}

export interface LawDoc {
  id: string; // "D.C. Law 25-108"
  law: string; // "25-108"
  act?: string;
  bill?: string;
  shortTitle: string;
  longTitle: string;
  effective?: string;
  temporary: boolean;
  emergency: boolean;
  /** The law rendered as plain bill text, the way a reader copies it from the enrolled act. */
  text: string;
  gold: GoldOp[];
  /** Council's LIMS link for the signed act, if published. */
  limsUrl?: string;
}

/** Flatten codify path segments into (section, path, part). */
export function resolveChain(segments: string[]): { section: string | null; path: string[]; part?: 'heading' | 'text' | 'num' } {
  const flat = segments.flatMap((s) => s.split('|')).filter(Boolean);
  let section: string | null = null;
  let path: string[] = [];
  let part: 'heading' | 'text' | 'num' | undefined;
  for (const seg of flat) {
    if (seg.startsWith('§')) {
      section = seg.slice(1);
      path = [];
      part = undefined;
    } else if (/^\(.+\)$/.test(seg)) {
      // "(b)(1)" style segments can be glued together.
      path.push(...(seg.match(/\([^()]+\)/g) ?? [seg]));
    } else if (seg === 'heading' || seg === 'text' || seg === 'num') part = seg;
  }
  return { section, path, part };
}

function renderLaw(root: Element): { text: string; provisions: Element[] } {
  const lines: string[] = [];
  const provisions: Element[] = [];
  const firstText = child(root, 'text');
  if (firstText) lines.push(inline(firstText));

  const renderInclude = (inc: Element, aftertext: string) => {
    const out: string[] = [];
    const walk = (e: Element) => {
      if (e.name !== 'para' && e.name !== 'section') {
        if (e.name === 'text') out.push(inline(e));
        else kids(e).forEach(walk);
        return;
      }
      const num = child(e, 'num');
      const heading = child(e, 'heading');
      const text = child(e, 'text');
      const head = [e.name === 'section' && num ? (/[-:]/.test(inline(num)) ? `§ ${inline(num)}.` : `Sec. ${inline(num)}.`) : num ? inline(num) : '', heading ? inline(heading) : '', text ? inline(text) : '']
        .filter(Boolean)
        .join(' ');
      if (head) out.push(head);
      for (const c of kids(e)) if (c.name === 'para' || c.name === 'section') walk(c);
      const at = child(e, 'aftertext');
      if (at) out.push(inline(at));
    };
    for (const c of kids(inc)) walk(c);
    if (out.length === 0) return;
    out[out.length - 1] = `${out[out.length - 1]}”${aftertext}`;
    for (const l of out) lines.push(`“${l}`);
  };

  const walk = (e: Element, depth: number) => {
    const isSection = e.name === 'section';
    const num = child(e, 'num');
    const heading = child(e, 'heading');
    const text = child(e, 'text');
    const numStr = num ? inline(num) : '';
    const label = isSection ? `Sec. ${numStr}.` : numStr;
    const body = [heading ? inline(heading) : '', text ? inline(text) : ''].filter(Boolean).join(' ');
    provisions.push(e);
    lines.push([label, body].filter(Boolean).join(' '));
    const at = child(e, 'aftertext');
    for (const c of kids(e)) {
      if (c.name === 'para') walk(c, depth + 1);
      else if (c.name === 'include') renderInclude(c, at ? inline(at) : '');
    }
  };
  for (const c of kids(root)) if (c.name === 'section') walk(c, 0);
  return { text: lines.join('\n'), provisions };
}

const OPS = new Set(['codify:find-replace', 'codify:insert', 'codify:replace', 'codify:repeal', 'codify:redesignate-para']);

/** Parse a law file: metadata, bill-like text and the codifiers' gold operations. */
export function lawFromXml(xml: string): LawDoc {
  const doc = parseXml(xml);
  const root = doc.children.find((n): n is Element => isEl(n) && n.name === 'document');
  if (!root) throw new Error('no <document> root');
  const nums = kids(root).filter((c) => c.name === 'num');
  const numOf = (t: string) => nums.find((n) => n.attribs.type === t);
  const headings = kids(root).filter((c) => c.name === 'heading');
  const meta = child(root, 'meta');
  const law = numOf('law') ? inline(numOf('law')) : '';
  const { text, provisions } = renderLaw(root);
  const provIndex = new Map(provisions.map((p, i) => [p, i]));

  const gold: GoldOp[] = [];
  const walk = (e: Element, chain: string[], prov: Element | null, inInclude: Element | null) => {
    const c = e.attribs['codify:path'] ? [...chain, e.attribs['codify:path']] : chain;
    const isProv = !inInclude && (e.name === 'para' || e.name === 'section');
    const p = isProv ? e : prov;
    if (OPS.has(e.name)) {
      const docAttr = e.attribs.doc;
      if (docAttr && docAttr !== 'D.C. Code') return; // amends an uncodified law
      const opChain = e.attribs.path ? [...c, e.attribs.path] : c;
      const r = resolveChain(opChain);
      const pi = p ? provIndex.get(p) ?? -1 : -1;
      const instrEl = p ? child(p, 'text') ?? child(p, 'heading') : undefined;
      const op: GoldOp = {
        kind: e.name.slice('codify:'.length) as GoldOp['kind'],
        chain: opChain.join('|'),
        section: r.section,
        path: r.path,
        ...(r.part ? { part: r.part } : {}),
        provision: pi,
        instruction: inline(instrEl),
      };
      if (e.attribs.count) op.count = Number(e.attribs.count);
      if (e.attribs.position) op.position = e.attribs.position;
      if (e.attribs.after) op.after = e.attribs.after;
      if (e.attribs['num-value']) op.numValue = e.attribs['num-value'];
      if (op.kind === 'find-replace') {
        op.find = inline(child(e, 'find'));
        op.replace = inline(child(e, 'replace'));
      }
      if ((op.kind === 'replace' || op.kind === 'insert') && e.parent && isEl(e.parent as AnyNode)) {
        const host = e.parent as Element;
        const n = toCodeNode(host);
        op.newText = [n.num, n.heading, n.text].filter(Boolean).join(' ');
      }
      gold.push(op);
      return;
    }
    const nextInclude = e.name === 'include' ? e : inInclude;
    for (const k of kids(e)) walk(k, c, p, nextInclude);
  };
  for (const k of kids(root)) walk(k, root.attribs['codify:path'] ? [root.attribs['codify:path']] : [], null, null);

  const lims = meta ? kids(child(meta, 'citations') ?? meta).find((c) => c.name === 'citation' && c.attribs.type === 'law')?.attribs.url : undefined;
  return {
    id: root.attribs.id ?? `D.C. Law ${law}`,
    law,
    act: numOf('act') ? inline(numOf('act')) : undefined,
    bill: numOf('bill') ? inline(numOf('bill')) : undefined,
    shortTitle: inline(headings.find((h) => h.attribs.type === 'short')),
    longTitle: inline(headings.find((h) => h.attribs.type === 'long')),
    effective: meta ? inline(child(meta, 'effective')) || undefined : undefined,
    temporary: !!(meta && child(meta, 'temporary')),
    emergency: !!(meta && child(meta, 'emergency')),
    text,
    gold,
    ...(lims ? { limsUrl: lims } : {}),
  };
}
