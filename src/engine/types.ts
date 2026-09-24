/**
 * Core types for the In Its Place engine.
 *
 * The engine is pure TypeScript with no DOM and no network, so the same code runs in
 * the browser (the app) and in Node (the data build and the benchmark).
 */

/** A provision of the D.C. Code as published by the Council (section, subsection, paragraph, ...). */
export interface CodeNode {
  /** Designation as printed, e.g. "38-501", "(a)", "(2A)". Absent for unnumbered text blocks. */
  num?: string;
  heading?: string;
  /** Text that precedes the children (the "lead-in" when children exist). */
  text?: string;
  children: CodeNode[];
  /** Text that follows the children (rare: e.g. a closing sentence after a list). */
  aftertext?: string;
  /** Set when the provision has been repealed and survives only as a placeholder. */
  placeholder?: 'Repealed' | string;
}

/** A whole section of the D.C. Code with its citation metadata. */
export interface CodeSection extends CodeNode {
  /** Section number without the § sign, e.g. "38-501" or "28:2-106". */
  num: string;
  /** Title number, e.g. "38". */
  title: string;
}

/** Where an instruction points inside the Code. */
export interface Target {
  /** Section number, e.g. "38-501". */
  section: string;
  /** Designations below the section, outermost first, e.g. ["(b)", "(1)"]. */
  path: string[];
  /** A named part of the target element rather than the element itself. */
  part?: 'heading' | 'lead-in' | 'num' | 'text';
}

export type Position = 'first' | 'last';

/** How many occurrences an instruction addresses. */
export type Occurrence =
  | { kind: 'one' }
  | { kind: 'all' }
  | { kind: 'count'; n: number }
  | { kind: 'position'; at: Position };

/** A new provision supplied by the bill (a quoted block). */
export interface NewNode extends CodeNode {}

export type Operation =
  | {
      type: 'find-replace';
      find: string;
      /** '' for a pure strike. */
      replace: string;
      occurrence: Occurrence;
    }
  | {
      /** Insert text relative to an anchor phrase ("inserting X after Y"), or at the end/start. */
      type: 'insert-text';
      text: string;
      anchor: { where: 'after' | 'before'; phrase: string; occurrence: Occurrence } | { where: 'end' | 'start' };
    }
  | { type: 'replace'; nodes: NewNode[] }
  | { type: 'repeal' }
  | {
      /** Add new provisions inside the target container. */
      type: 'insert-nodes';
      nodes: NewNode[];
      /** Designation of the sibling the new nodes follow; null = at the end, 'start' = at the beginning. */
      after: string | null | 'start';
    }
  | { type: 'redesignate'; from: string[]; to: string[] }
  | {
      /** A whole new section (or several) of the Code. */
      type: 'add-sections';
      sections: CodeSection[];
    };

/** Where an instruction came from in the bill. */
export interface SourceRef {
  /** Human label, e.g. "Sec. 2(a)(2)(B)". */
  label: string;
  /** Index of the bill paragraph (provision) the instruction lives in. */
  provision: number;
  /** The instruction sentence as it appears in the bill. */
  sentence: string;
}

/** One executable instruction: an operation applied to a target, traced to its source. */
export interface Instruction {
  id: string;
  target: Target;
  op: Operation;
  source: SourceRef;
}

export type DiagnosticLevel = 'query' | 'note';

/** Something a human should look at. "Query" follows the printer's term: a question to the author. */
export interface Diagnostic {
  level: DiagnosticLevel;
  code: string;
  message: string;
  /** Instruction the diagnostic is about, if any. */
  instruction?: string;
  /** Bill provision the diagnostic is about, if any. */
  provision?: number;
}

/** A paragraph of the bill as segmented from raw text. */
export interface Provision {
  index: number;
  /** Designations that open the paragraph, e.g. ["(a)", "(1)"] or ["Sec. 2."]. */
  nums: string[];
  text: string;
  /** Depth in the bill's own outline (0 = section). */
  depth: number;
  /** Label in bill-citation style, e.g. "Sec. 2(a)(1)". */
  label: string;
  /** Quoted material that follows this provision (new text supplied by the bill). */
  quoted?: QuotedBlock;
  /** Index of the enclosing provision, or -1. */
  parent: number;
}

/** A run of quoted paragraphs: text the bill puts into the Code. */
export interface QuotedBlock {
  paragraphs: { nums: string[]; text: string }[];
  /** Punctuation after the closing quotation mark (".", ";", ...). */
  after: string;
}

export interface CompileResult {
  provisions: Provision[];
  instructions: Instruction[];
  diagnostics: Diagnostic[];
  /** Short title of the act if the bill states one ("may be cited as the ..."). */
  shortTitle?: string;
}
