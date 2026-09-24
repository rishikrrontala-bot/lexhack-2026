/**
 * Compile a bill: raw text → provisions → executable instructions with resolved targets.
 *
 * Targets are resolved with a context stack that mirrors how D.C. bills are drafted:
 * "Sec. 2. The Act (… D.C. Official Code § 38-501 et seq.) is amended as follows:"
 * sets the act; "(a) Section 2 (D.C. Official Code § 38-501) is amended as follows:" sets
 * the section; "(2) Paragraph (2) is amended as follows:" narrows to (2); and
 * "(B) Strike the phrase …" acts on that context.
 */
import type { CodeSection, CompileResult, Diagnostic, Instruction, NewNode, Operation, Provision, QuotedBlock, Target } from './types';
import { segment } from './segment';
import { formLevel, parseInstruction, type PathStep, type RawOp, type TargetRef } from './grammar';
import { clip } from './text';

interface Ctx {
  section?: string;
  steps: PathStep[];
  part?: Target['part'];
  actWide?: boolean;
}

function compose(parent: Ctx | undefined, ref: TargetRef): Ctx {
  if (ref.section) return { section: ref.section, steps: ref.steps, ...(ref.part ? { part: ref.part } : {}), ...(ref.actWide ? { actWide: true } : {}) };
  const base = parent ?? { steps: [] };
  if (!ref.steps.length) return { ...base, ...(ref.part ? { part: ref.part } : { part: base.part }) };
  const lvl = ref.steps[0]!.level;
  const kept = base.steps.filter((s) => s.level < lvl);
  return { section: base.section, steps: [...kept, ...ref.steps], ...(ref.part ? { part: ref.part } : {}) };
}

/** Rebuild the provision tree of a quoted block from its flat paragraphs. */
export function quotedToNodes(block: QuotedBlock): NewNode[] {
  const roots: NewNode[] = [];
  const stack: { level: number; node: NewNode }[] = [];
  let firstLevel: number | undefined;
  for (const p of block.paragraphs) {
    const num = p.nums[p.nums.length - 1];
    if (!num) {
      // Unnumbered paragraph: heading-less text of the current provision, or a trailing block.
      const top = stack[stack.length - 1];
      if (top && !top.node.text) top.node.text = p.text;
      else if (top) top.node.children.push({ text: p.text, children: [] });
      else roots.push({ text: p.text, children: [] });
      continue;
    }
    if (num.startsWith('§') || num.startsWith('Sec.')) {
      const sec: NewNode = { num: num.replace(/^§\s*|^Sec\.\s*/, ''), children: [] };
      if (num.startsWith('Sec.')) (sec as NewNode & { actSection?: boolean }).actSection = true;
      if (p.text) sec.heading = p.text;
      roots.push(sec);
      stack.length = 0;
      stack.push({ level: 0, node: sec });
      continue;
    }
    // Combined designations "(a)(1) Text": create the chain.
    let prevLevel = stack.length ? stack[stack.length - 1]!.level : undefined;
    for (const [i, d] of p.nums.entries()) {
      const level = formLevel(d, prevLevel);
      if (firstLevel === undefined) firstLevel = level;
      const node: NewNode = { num: d, children: [] };
      if (i === p.nums.length - 1) node.text = p.text;
      while (stack.length && stack[stack.length - 1]!.level >= level) stack.pop();
      const parent = stack[stack.length - 1];
      if (parent) parent.node.children.push(node);
      else roots.push(node);
      stack.push({ level, node });
      prevLevel = level;
    }
  }
  // Trailing punctuation after the closing quote (e.g. ";" or ".") is the bill's own
  // sentence punctuation, not part of the new text.
  return roots;
}

function toTarget(ctx: Ctx): Target | null {
  if (!ctx.section) return null;
  return { section: ctx.section, path: ctx.steps.map((s) => s.d), ...(ctx.part ? { part: ctx.part } : {}) };
}

function lowerOp(raw: RawOp, prov: Provision, diags: Diagnostic[]): Operation | null {
  switch (raw.type) {
    case 'strike-insert':
      return { type: 'find-replace', find: raw.find, replace: raw.replace, occurrence: raw.occurrence };
    case 'strike':
      return { type: 'find-replace', find: raw.find, replace: '', occurrence: raw.occurrence };
    case 'insert-text':
      return { type: 'insert-text', text: raw.text, anchor: { where: raw.where, phrase: raw.anchor, occurrence: raw.occurrence } };
    case 'insert-text-edge':
      return { type: 'insert-text', text: raw.text, anchor: { where: raw.where } };
    case 'repeal':
      return { type: 'repeal' };
    case 'redesignate':
      return { type: 'redesignate', from: raw.from, to: raw.to };

    case 'read-as-follows': {
      if (!prov.quoted) {
        diags.push({ level: 'query', code: 'no-quoted-text', message: 'Says "to read as follows" but no quoted text follows it.', provision: prov.index });
        return null;
      }
      return { type: 'replace', nodes: quotedToNodes(prov.quoted) };
    }
    case 'add-nodes': {
      if (raw.inline) return { type: 'insert-text', text: raw.inline, anchor: { where: 'end' } };
      if (!prov.quoted) {
        diags.push({ level: 'query', code: 'no-quoted-text', message: 'Adds new provisions but no quoted text follows it.', provision: prov.index });
        return null;
      }
      const nodes = quotedToNodes(prov.quoted);
      if (nodes.length && nodes.every((n) => ((n as { actSection?: boolean }).actSection || (/^\d/.test(n.num ?? '') && /[-:]/.test(n.num ?? ''))))) {
        return {
          type: 'add-sections',
          sections: nodes.map((n) => ({ ...n, num: n.num!, title: (/^(\d+[A-Z]?)[-:]/.exec(n.num!)?.[1] ?? '') }) as CodeSection),
        };
      }
      return { type: 'insert-nodes', nodes, after: raw.afterHint ?? null };
    }
    case 'unparsed':
      diags.push({ level: 'query', code: 'unparsed', message: `Could not read this instruction: “${clip(raw.clause, 140)}”`, provision: prov.index });
      return null;
  }
}

export function compile(raw: string): CompileResult {
  const { provisions, shortTitle } = segment(raw);
  const ctxOf: (Ctx | undefined)[] = [];
  const instructions: Instruction[] = [];
  const diagnostics: Diagnostic[] = [];

  for (const prov of provisions) {
    const parentCtx = prov.parent >= 0 ? ctxOf[prov.parent] : undefined;
    if (!prov.nums.length && !prov.text) continue;
    const parsed = parseInstruction(prov.text);
    let ctxs: Ctx[] = parsed.refs.length ? parsed.refs.map((r) => compose(parentCtx, r)) : parentCtx ? [parentCtx] : [];
    // "Redesignate the paragraph as paragraph (1A)": the object is the context itself.
    const selfRed = parsed.ops.find((o) => o.type === 'redesignate' && o.from[0] === '@self');
    if (selfRed && selfRed.type === 'redesignate' && parentCtx?.steps.length) {
      selfRed.from = [parentCtx.steps[parentCtx.steps.length - 1]!.d];
      ctxs = [{ ...parentCtx, steps: parentCtx.steps.slice(0, -1) }];
    }
    // A provision's context is inherited by its children (first ref wins for context).
    ctxOf[prov.index] = ctxs[0] ?? parentCtx;
    if (parsed.inert || parsed.contextOnly) continue;
    if (!parsed.ops.length) continue;

    if (!ctxs.length || ctxs.every((c) => !c.section)) {
      const hasReal = parsed.ops.some((o) => o.type !== 'unparsed');
      if (hasReal) {
        diagnostics.push({
          level: 'query',
          code: 'no-target',
          message: 'Could not tell which section of the D.C. Code this instruction amends.',
          provision: prov.index,
        });
        continue;
      }
    }
    // Section-level new provisions added to a chapter carry their own numbers.
    let n = 0;
    for (const rawOp of parsed.ops) {
      const op = lowerOp(rawOp, prov, diagnostics);
      if (!op) continue;
      if (op.type === 'add-sections') {
        n++;
        instructions.push({
          id: `${prov.label || `¶${prov.index}`}${parsed.ops.length > 1 ? `#${n}` : ''}`,
          target: { section: op.sections[0]!.num, path: [] },
          op,
          source: { label: prov.label, provision: prov.index, sentence: prov.text },
        });
        continue;
      }
      for (const c of ctxs) {
        const target = toTarget(c);
        if (!target) continue;
        n++;
        instructions.push({
          id: `${prov.label || `¶${prov.index}`}${parsed.ops.length > 1 || ctxs.length > 1 ? `#${n}` : ''}`,
          target,
          op,
          source: { label: prov.label, provision: prov.index, sentence: prov.text },
        });
      }
    }
    if (ctxs.length) ctxs = [];
  }
  return { provisions, instructions, diagnostics, ...(shortTitle ? { shortTitle } : {}) };
}
