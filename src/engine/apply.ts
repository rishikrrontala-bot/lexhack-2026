import type { CodeSection, Diagnostic, Instruction, Occurrence } from './types';
import { cloneNode, locate, normNum } from './code';
import { findAll } from './text';

export interface AppliedEdit { id: string; source: Instruction['source']; target: Instruction['target']; before: string; after: string; kind: string }
export interface ApplyResult { section: CodeSection; edits: AppliedEdit[]; diagnostics: Diagnostic[] }

function choose(matches: { start: number; end: number }[], occurrence: Occurrence) {
  if (occurrence.kind === 'all') return matches;
  if (occurrence.kind === 'count') return matches.length === occurrence.n ? matches : [];
  if (occurrence.kind === 'position') return matches.length ? [occurrence.at === 'first' ? matches[0]! : matches[matches.length - 1]!] : [];
  return matches.length === 1 ? matches : [];
}

function replaceAt(text: string, matches: {start:number;end:number}[], replacement: string) {
  let result = text;
  for (const match of [...matches].reverse()) result = result.slice(0, match.start) + replacement + result.slice(match.end);
  return result;
}

export function applyInstructions(original: CodeSection, instructions: Instruction[]): ApplyResult {
  const section = cloneNode(original);
  const edits: AppliedEdit[] = [];
  const diagnostics: Diagnostic[] = [];
  const query = (inst: Instruction, code: string, message: string) => diagnostics.push({level:'query', code, message, instruction:inst.id, provision:inst.source.provision});
  for (const inst of instructions) {
    if (normNum(inst.target.section) !== normNum(section.num)) continue;
    const loc = locate(section, inst.target.path);
    if (!loc) { query(inst, 'missing-target', `Could not find ${inst.target.section}${inst.target.path.join('')} in this Code snapshot.`); continue; }
    const node = loc.node;
    const op = inst.op;
    const before = node.text ?? '';
    if (op.type === 'find-replace') {
      const matches = findAll(before, op.find);
      const selected = choose(matches, op.occurrence);
      if (!selected.length) { query(inst, 'phrase-mismatch', `Expected phrase not found exactly once, or occurrence count differed: “${op.find}”.`); continue; }
      node.text = replaceAt(before, selected, op.replace);
    } else if (op.type === 'insert-text') {
      const anchor = op.anchor;
      if (anchor.where === 'end') node.text = before + op.text;
      else if (anchor.where === 'start') node.text = op.text + before;
      else if ('phrase' in anchor) {
        const matches = choose(findAll(before, anchor.phrase), anchor.occurrence);
        if (!matches.length) { query(inst, 'anchor-mismatch', `Could not find insertion anchor “${anchor.phrase}”.`); continue; }
        let result = before;
        for (const match of [...matches].reverse()) {
          const at = anchor.where === 'after' ? match.end : match.start;
          result = result.slice(0, at) + op.text + result.slice(at);
        }
        node.text = result;
      }
    } else if (op.type === 'replace') {
      if (!loc.parent || op.nodes.length !== 1) { query(inst, 'replace-shape', 'This replacement has an unsupported structure.'); continue; }
      const replacement = cloneNode(op.nodes[0]!);
      if (!replacement.num) replacement.num = node.num;
      loc.parent.children[loc.index] = replacement;
    } else if (op.type === 'repeal') {
      node.text = 'Repealed.'; node.children = []; node.placeholder = 'Repealed';
    } else if (op.type === 'insert-nodes') {
      const nodes = op.nodes.map(n => cloneNode(n));
      if (!nodes.length) { query(inst, 'empty-insert', 'No provision text was supplied.'); continue; }
      const existing = new Set(node.children.map(c => normNum(c.num)));
      if (nodes.some(n => existing.has(normNum(n.num)))) { query(inst, 'number-collision', 'A new provision uses a designation already in the Code.'); continue; }
      let at = node.children.length;
      if (op.after === 'start') at = 0;
      else if (op.after) {
        const i = node.children.findIndex(c => normNum(c.num) === normNum(op.after!));
        if (i < 0) { query(inst, 'missing-sibling', `Could not find insertion point ${op.after}.`); continue; }
        at = i + 1;
      }
      node.children.splice(at, 0, ...nodes);
    } else if (op.type === 'redesignate') {
      const child = node.children.find(c => normNum(c.num) === normNum(op.from[0]));
      if (!child || op.to.length !== 1) { query(inst, 'redesignate-shape', 'Could not locate the designation to change.'); continue; }
      child.num = op.to[0];
    } else {
      query(inst, 'unsupported-op', 'Adding whole Code sections is outside this section-level replay.'); continue;
    }
    const changed = op.type === 'replace' ? (loc.parent?.children[loc.index]?.text ?? '') : op.type === 'insert-nodes' ? op.nodes.map(n=>`${n.num} ${n.text ?? ''}`).join('\n') : node.text ?? '';
    edits.push({id:inst.id, source:inst.source, target:inst.target, before, after:changed, kind:op.type});
  }
  return {section, edits, diagnostics};
}
