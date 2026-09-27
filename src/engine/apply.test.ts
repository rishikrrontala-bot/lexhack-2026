import { describe, expect, it } from 'vitest';
import example from '../data/example.json';
import { compile } from './compile';
import { applyInstructions } from './apply';
import { canon } from './text';
import type { CodeSection, Instruction } from './types';

describe('one real Council law replay', () => {
  const instructions = compile(example.law.text).instructions.filter(i => i.target.section === '38-501');
  it('compiles and applies the twelve scoped instructions without hiding queries', () => {
    const result = applyInstructions(example.section.before as CodeSection, instructions);
    expect(instructions).toHaveLength(12);
    expect(result.edits).toHaveLength(12);
    expect(result.diagnostics).toHaveLength(0);
  });
  it('reproduces the core amended paragraph while preserving source provenance', () => {
    const result = applyInstructions(example.section.before as CodeSection, instructions);
    expect(canon(result.section.children[1]!.text!)).toBe(canon(example.section.after.children[1]!.text!));
    expect(result.edits.find(e => e.source.label.includes('(2)(B)'))?.after).toContain('medical or religious exemption');
  });
  it('flags a phrase that is absent instead of inventing an edit', () => {
    const bad: Instruction = {...instructions[1]!, op: {type:'find-replace',find:'nonexistent phrase',replace:'X',occurrence:{kind:'one'}}};
    const result = applyInstructions(example.section.before as CodeSection, [bad]);
    expect(result.edits).toHaveLength(0);
    expect(result.diagnostics[0]?.code).toBe('phrase-mismatch');
  });
});
