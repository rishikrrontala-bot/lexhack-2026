/**
 * Comparable signatures for engine instructions and the codifiers' gold operations,
 * so the benchmark can score agreement with a multiset match.
 */
import type { Instruction } from '../../src/engine/types';
import { canon } from '../../src/engine/text';
import { normNum } from '../../src/engine/code';
import type { GoldOp } from './dcxml';

/** Text comparison form: canonical, and tolerant of a space before punctuation. */
export function tsig(s: string): string {
  return canon(s).replace(/\s+([.,;:)])/g, '$1').replace(/\(\s+/g, '(').toLowerCase();
}

const pth = (section: string | null, path: string[]) => `${section ?? '?'}${path.map((p) => `(${normNum(p)})`).join('')}`;

export type Kind = 'find-replace' | 'repeal' | 'replace' | 'insert' | 'redesignate';

export interface Sig {
  kind: Kind;
  key: string;
}

export function goldSigs(g: GoldOp): Sig[] {
  const where = pth(g.section, g.path) + (g.part ? `|${g.part}` : '');
  switch (g.kind) {
    case 'find-replace': {
      const f = (g.find ?? '').trim();
      const r = (g.replace ?? '').trim();
      // Codifiers sometimes encode a redesignation as a find-replace on the designation.
      if (/^\([A-Za-z0-9-]+\)$/.test(f) && /^\([A-Za-z0-9-]+\)$/.test(r)) {
        const base = g.part === 'num' ? g.path : [...g.path, f];
        return [{ kind: 'redesignate', key: `RD|${pth(g.section, base)}→${normNum(r)}` }];
      }
      return [{ kind: 'find-replace', key: `FR|${where}|${tsig(f)}→${tsig(r)}` }];
    }
    case 'repeal':
      return [{ kind: 'repeal', key: `RP|${where}` }];
    case 'replace':
      return [{ kind: 'replace', key: `RE|${where}` }];
    case 'insert':
      if (g.numValue && /^\d/.test(g.numValue) && /[-:]/.test(g.numValue)) return [{ kind: 'insert', key: 'NS|new-section' }];
      return [{ kind: 'insert', key: `IN|${where}|${normNum(g.numValue ?? '')}` }];
    case 'redesignate-para':
      return [{ kind: 'redesignate', key: `RD|${pth(g.section, g.path)}→${normNum(g.numValue ?? '')}` }];
  }
}

export function instrSigs(ins: Instruction): Sig[] {
  const t = ins.target;
  const where = pth(t.section, t.path) + (t.part && t.part !== 'lead-in' ? `|${t.part}` : '');
  const op = ins.op;
  switch (op.type) {
    case 'find-replace':
      return [{ kind: 'find-replace', key: `FR|${where}|${tsig(op.find)}→${tsig(op.replace)}` }];
    case 'insert-text': {
      if ('phrase' in op.anchor) {
        const rep = op.anchor.where === 'after' ? `${op.anchor.phrase} ${op.text}` : `${op.text} ${op.anchor.phrase}`;
        return [{ kind: 'find-replace', key: `FR|${where}|${tsig(op.anchor.phrase)}→${tsig(rep)}` }];
      }
      return [{ kind: 'find-replace', key: `FRE|${where}|${op.anchor.where}|${tsig(op.text)}` }];
    }
    case 'repeal':
      return [{ kind: 'repeal', key: `RP|${where}` }];
    case 'replace':
      return [{ kind: 'replace', key: `RE|${where}` }];
    case 'insert-nodes':
      return op.nodes.map((n) => ({ kind: 'insert' as const, key: `IN|${where}|${normNum(n.num ?? '')}` }));
    case 'add-sections':
      return op.sections.map(() => ({ kind: 'insert' as const, key: 'NS|new-section' }));
    case 'redesignate':
      return op.from.map((f, i) => ({ kind: 'redesignate' as const, key: `RD|${pth(t.section, [...t.path, f])}→${normNum(op.to[i] ?? '')}` }));
  }
}

/** Gold ops that come from an amending instruction (as opposed to codifier editorial actions
 * such as "Not funded" notes driven by applicability clauses). */
export function isInstructional(g: GoldOp): boolean {
  return /amend|strik|insert|repeal|add|redesignat|designat|renumber|read as follows/i.test(g.instruction);
}
