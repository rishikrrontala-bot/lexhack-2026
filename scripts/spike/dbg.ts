import { readFileSync } from 'node:fs';
import { lawFromXml } from '../lib/dcxml';
import { compile } from '../../src/engine/compile';
import { describeTarget } from '../../src/engine/code';
const [p, n, from, to] = process.argv.slice(2);
const law = lawFromXml(readFileSync(`data-cache/law-xml/us/dc/council/periods/${p}/laws/${p}-${n}.xml`, 'utf8'));
const r = compile(law.text);
for (const pr of r.provisions.slice(Number(from ?? 0), Number(to ?? 40))) {
  const ins = r.instructions.filter((i) => i.source.provision === pr.index);
  console.log(`[${pr.index}] ${pr.label} d${pr.depth} p${pr.parent} :: ${pr.text.slice(0, 110)}${pr.quoted ? ` [Q:${pr.quoted.paragraphs.length}]` : ''}`);
  for (const i of ins) console.log(`     → ${i.op.type} ${describeTarget(i.target)} ${JSON.stringify(i.op).slice(0, 100)}`);
}
for (const d of r.diagnostics.slice(0, 10)) console.log('DIAG', d.provision, d.message.slice(0, 140));
