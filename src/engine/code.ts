/**
 * The D.C. Code as a tree, and how instruction targets are resolved inside it.
 */
import type { CodeNode, CodeSection, Target } from './types';
import { canon } from './text';

/** Normalize a designation for comparison: "(a)" and "a" and " (a) " are the same. */
export function normNum(num: string | undefined): string {
  if (!num) return '';
  return num.replace(/[()\s§]/g, '').replace(/[‐‑‒–—]/g, '-').toLowerCase();
}

/** "(b)(1)(A)" → ["(b)", "(1)", "(A)"] */
export function splitDesignations(s: string): string[] {
  return s.match(/\([^()\s]+\)/g) ?? [];
}

/** Section-number form used in file names and URLs: "§ 38-501" → "38-501". */
export function sectionId(s: string): string {
  return s.replace(/§/g, '').replace(/\s+/g, '').replace(/[‐‑‒–—]/g, '-').replace(/\.$/, '');
}

/** Title a section belongs to: "38-501" → "38", "28:2-106" → "28". */
export function titleOf(section: string): string {
  const m = /^(\d+[A-Z]?)[-:]/.exec(sectionId(section));
  return m ? m[1]! : sectionId(section).split(/[-:]/)[0]!;
}

/** Public URL of a section on the Council's official site. */
export function sectionUrl(section: string): string {
  return `https://code.dccouncil.gov/us/dc/council/code/sections/${encodeURIComponent(sectionId(section))}`;
}

/** Public URL of a D.C. Law on the Council's official site. */
export function lawUrl(lawNumber: string): string {
  return `https://code.dccouncil.gov/us/dc/council/laws/${encodeURIComponent(lawNumber)}`;
}

export interface Located {
  node: CodeNode;
  parent: CodeNode | null;
  index: number;
  /** Designations actually walked, for messages. */
  walked: string[];
}

/**
 * Walk a designation path from a section. Tolerates the common drafting shortcut of
 * skipping a level when the skipped level is unambiguous (e.g. "paragraph (2)" addressed
 * directly under a section whose (2) lives inside an unnumbered wrapper).
 */
export function locate(section: CodeNode, path: string[]): Located | null {
  let node: CodeNode = section;
  let parent: CodeNode | null = null;
  let index = -1;
  const walked: string[] = [];
  for (const d of path) {
    const want = normNum(d);
    let found = node.children.findIndex((c) => normNum(c.num) === want);
    if (found < 0) {
      // One level of unnumbered wrappers is transparent.
      for (const [i, c] of node.children.entries()) {
        if (c.num) continue;
        const j = c.children.findIndex((cc) => normNum(cc.num) === want);
        if (j >= 0) {
          parent = c;
          node = c.children[j]!;
          index = j;
          found = -2;
          void i;
          break;
        }
      }
      if (found !== -2) return null;
      walked.push(d);
      continue;
    }
    parent = node;
    index = found;
    node = node.children[found]!;
    walked.push(d);
  }
  return { node, parent, index, walked };
}

/** Deep clone (sections are plain JSON). */
export function cloneNode<T extends CodeNode>(n: T): T {
  return JSON.parse(JSON.stringify(n)) as T;
}

/** Plain text of a provision and everything under it, in reading order. */
export function nodeText(n: CodeNode, withNums = true): string {
  const parts: string[] = [];
  const walk = (x: CodeNode) => {
    const head = [withNums && x.num ? x.num : '', x.heading ?? '', x.text ?? ''].filter(Boolean).join(' ');
    if (head) parts.push(head);
    for (const c of x.children) walk(c);
    if (x.aftertext) parts.push(x.aftertext);
  };
  walk(n);
  return parts.join('\n');
}

/** Canonical comparison form of a whole section: used to check a replay against the codifiers. */
export function sectionFingerprint(n: CodeNode): string {
  return canon(nodeText(n, true));
}

/** Human citation of a target: "§ 38-501(2)(B)" with an optional part. */
export function describeTarget(t: Target): string {
  const part = t.part === 'lead-in' ? ' (lead-in text)' : t.part === 'heading' ? ' (heading)' : t.part === 'num' ? ' (designation)' : '';
  return `§ ${t.section}${t.path.join('')}${part}`;
}

export function isSection(n: CodeNode): n is CodeSection {
  return typeof (n as CodeSection).title === 'string';
}
