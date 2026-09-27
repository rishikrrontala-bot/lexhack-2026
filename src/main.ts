import example from './data/example.json';
import { compile } from './engine/compile';
import { applyInstructions, type AppliedEdit } from './engine/apply';
import { sectionFingerprint } from './engine/code';
import type { CodeSection } from './engine/types';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `<header class="top"><a class="logo" href="#top" aria-label="In Its Place home"><span>IN</span><b>‸<small>ITS</small></b><span>PLACE</span></a><div class="top-meta">A PUBLIC LAW PROOF DESK <span>◆</span> DISTRICT OF COLUMBIA</div><a class="top-link" href="#about">HOW IT WORKS ↗</a></header>
<main id="top"><section class="intro"><div class="intro-index">01 — THE PROBLEM</div><div class="intro-grid"><h1>Read the law<br>a bill <em>would make.</em></h1><div class="intro-aside"><p>Legislation is written as instructions to edit existing law. <strong>In Its Place</strong> lays the instruction beside the words it changes, so the resulting law is visible before you have to imagine it.</p><a href="#desk">OPEN THE PROOF DESK <span>↓</span></a></div></div><div class="source-strip"><span>ONE REAL D.C. LAW</span><span>ONE OFFICIAL CODE SECTION</span><span>EVERY MARK TRACEABLE</span></div></section>
<section class="desk" id="desk"><div class="desk-heading"><div><div class="kicker">02 — THE PROOF DESK</div><h2>Instructions, <em>in place.</em></h2></div><p>Start with D.C. Law 25-108. The compiler reads its amendments to § 38-501 and applies supported edits to the Code as it stood before the law took effect.</p></div><div class="control-row"><button id="example" class="chip active" type="button">D.C. Law 25-108 <span>↗</span></button><span>IMMUNIZATION OF SCHOOL STUDENTS AMENDMENT ACT OF 2023</span><a href="https://code.dccouncil.gov/us/dc/council/laws/25-108" target="_blank" rel="noopener noreferrer">READ ORIGINAL LAW ↗</a></div>
<div class="proof-grid"><div class="bill"><div class="panel-head"><span>THE BILL / INPUT</span><span>01</span></div><label for="bill-text">AMENDING TEXT <span>EDITABLE</span></label><textarea id="bill-text" spellcheck="false" aria-describedby="bill-help"></textarea><p id="bill-help" class="help">The real law is preloaded. You can edit it; the replay remains scoped to official § 38-501.</p><button id="compile" class="compile" type="button">PROOF THIS BILL <span>→</span></button><div id="parse-summary" class="parse-summary" aria-live="polite">Press “Proof this bill” to inspect its instructions.</div><div id="instructions" class="instructions" aria-label="Compiled amendment instructions"></div></div>
<div class="galley"><div class="panel-head"><span>THE GALLEY / § 38-501</span><span>02</span></div><div class="galley-paper"><div class="slug"><span>D.C. OFFICIAL CODE · DEFINITIONS</span><span>38—501</span></div><div id="proof-empty" class="proof-empty"><div class="caret">‸</div><p>The edits are waiting<br>in the margin.</p><small>Proof the bill to see words removed, words inserted, and their source instruction.</small></div><div id="proof-content" hidden><div class="result-head"><span id="edit-number">MARK 01 / 12</span><span id="edit-target">§ 38-501</span></div><div id="before-block" class="text-block"><div class="block-label">BEFORE · CODE PUBLICATION 2023-12-11</div><div id="before-text" class="law-text"></div></div><div id="after-block" class="text-block after"><div class="block-label">AFTER THE BILL’S INSTRUCTION · ENGINE REPLAY</div><div id="after-text" class="law-text"></div></div><div class="trace"><span>TRACE ↖</span><p id="trace-text"></p></div></div></div><div class="publication"><span>PUBLICATION CHECK</span><p id="publication-copy">The official after-publication is compared only for the unedited sample bill. The Council may also make editorial changes while codifying.</p><a href="https://code.dccouncil.gov/us/dc/council/code/sections/38-501" target="_blank" rel="noopener noreferrer">OPEN THE OFFICIAL CODE ↗</a></div></div></div></section>
<section class="about" id="about"><div class="kicker">03 — THE METHOD</div><div class="about-grid"><h2>No black box.<br><em>No guessed edits.</em></h2><div><p><b>01 / COMPILE</b><span>Read section targets and editing verbs from the bill’s own text.</span></p><p><b>02 / APPLY</b><span>Find the target in the historical Code snapshot. Mark a query if a phrase or designation cannot be found.</span></p><p><b>03 / TRACE</b><span>Keep the source sentence attached to each changed run.</span></p><p><b>04 / COMPARE</b><span>Check the replay against the Council’s published text, while showing where codification differs.</span></p></div></div><div class="boundary"><strong>NOT LEGAL ADVICE OR AN OFFICIAL PUBLICATION.</strong><span>This prototype covers one D.C. Code section and a subset of drafting patterns. It shows unsupported instructions as queries. Always use the Council’s publication for authoritative text.</span></div></section></main><footer><span>IN ‸ PLACE</span><span>Built by Rishik Rontala · LexHack 2026</span><a href="https://github.com/rishikrrontala-bot/lexhack-2026">SOURCE CODE ↗</a></footer>`;

const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const bill = $<HTMLTextAreaElement>('#bill-text');
bill.value = example.law.text;
let edits: AppliedEdit[] = [];

function text(selector: string, value: string) { $(selector).textContent = value; }
function lineDiff(before: string, after: string, target: HTMLElement) {
  target.replaceChildren();
  let start = 0; while (start < before.length && start < after.length && before[start] === after[start]) start++;
  let end = 0; while (end < before.length - start && end < after.length - start && before[before.length - 1 - end] === after[after.length - 1 - end]) end++;
  const oldMiddle = before.slice(start, before.length - end || undefined);
  const newMiddle = after.slice(start, after.length - end || undefined);
  target.append(document.createTextNode(before.slice(0,start)));
  if (oldMiddle) { const del = document.createElement('del'); del.textContent = oldMiddle; target.append(del); }
  if (oldMiddle && newMiddle) { const divider = document.createElement('span'); divider.className = 'change-divider'; divider.textContent = ' → '; divider.setAttribute('aria-label', 'changes to'); target.append(divider); }
  if (newMiddle) { const ins = document.createElement('ins'); ins.textContent = newMiddle; target.append(ins); }
  target.append(document.createTextNode(after.slice(after.length - end)));
}
function selectEdit(index: number) {
  const edit = edits[index]; if (!edit) return;
  $('#proof-empty').hidden = true; $('#proof-content').hidden = false;
  text('#edit-number', `MARK ${String(index+1).padStart(2,'0')} / ${edits.length}`);
  text('#edit-target', `§ ${edit.target.section}${edit.target.path.join('')}`);
  text('#trace-text', `${edit.source.label}: ${edit.source.sentence}`);
  const designation = edit.target.path.at(-1) ?? '';
  const beforeText = `${designation} ${edit.before}`.trim();
  const afterText = `${designation} ${edit.after}`.trim();
  lineDiff(beforeText, afterText, $('#after-text'));
  text('#before-text', beforeText);
  document.querySelectorAll<HTMLButtonElement>('.instruction').forEach((button,i) => {button.classList.toggle('selected',i===index);button.setAttribute('aria-pressed',String(i===index));});
}
function run() {
  const compiled = compile(bill.value.slice(0,45000));
  const scoped = compiled.instructions.filter(i=>i.target.section==='38-501');
  const result = applyInstructions(example.section.before as CodeSection, scoped);
  edits = result.edits;
  const queries = compiled.diagnostics.length + result.diagnostics.length;
  const otherSections = compiled.instructions.length - scoped.length;
  text('#parse-summary', `${scoped.length} instructions target § 38-501 · ${edits.length} applied · ${queries} queries · ${otherSections} instructions for other sections`);
  const list = $('#instructions'); list.replaceChildren();
  for (const [i, edit] of edits.entries()) {
    const button = document.createElement('button'); button.type='button'; button.className='instruction'; button.setAttribute('aria-pressed','false');
    const label = document.createElement('b'); label.textContent = edit.source.label;
    const sentence = document.createElement('span'); sentence.textContent = edit.source.sentence;
    button.append(label,sentence); button.addEventListener('click',()=>selectEdit(i)); list.append(button);
  }
  for (const diag of [...compiled.diagnostics,...result.diagnostics]) {
    const note=document.createElement('div');note.className='query';note.textContent=`Qy · ${diag.message}`;list.append(note);
  }
  if (edits.length) selectEdit(edits.findIndex(e=>e.id.includes('(2)(B)')) >= 0 ? edits.findIndex(e=>e.id.includes('(2)(B)')) : 0);
  else {$('#proof-empty').hidden=false;$('#proof-content').hidden=true;}
  const sameSample = bill.value.trim()===example.law.text.trim();
  const samePublished = sectionFingerprint(result.section)===sectionFingerprint(example.section.after as CodeSection);
  text('#publication-copy', sameSample ? (samePublished ? 'The replay matches the Council’s published § 38-501 after canonical whitespace and quote comparison.' : 'The replay applies all 12 scoped instructions, but the whole section is not identical to the Council’s later publication. Four added definitions contain editorial cross-reference changes; one deletion also leaves spacing that the codifier normalized. The proof keeps these differences visible rather than claiming an exact match.') : 'Publication comparison is reserved for the original sample. Edited input has no official after-publication to compare against.');
}
$('#compile').addEventListener('click', run);
$('#example').addEventListener('click',()=>{bill.value=example.law.text;bill.focus();});
