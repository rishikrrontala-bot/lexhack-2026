import { readFileSync, readdirSync } from 'node:fs';
import { parseDocument } from 'htmlparser2';
import type { Element, Node } from 'domhandler';
const root = '/tmp/dc/law-xml/us/dc/council/periods';
const isEl = (n: Node): n is Element => (n as any).type === 'tag';
const attrCount = new Map<string, number>(); const pathForms = new Map<string, number>(); const ex: string[] = [];
let ops = 0;
for (const p of ['25']) for (const f of readdirSync(`${root}/${p}/laws`)) {
  const doc = parseDocument(readFileSync(`${root}/${p}/laws/${f}`, 'utf8'), { xmlMode: true });
  const walk = (n: Node, chain: string[]) => {
    if (!isEl(n)) return;
    const c = n.attribs['codify:path'] ? [...chain, n.attribs['codify:path']] : chain;
    if (n.name.startsWith('codify:') && ['codify:find-replace','codify:insert','codify:replace','codify:repeal','codify:redesignate-para'].includes(n.name)) {
      ops++;
      const k = n.name + ' ' + Object.keys(n.attribs).sort().join(',');
      attrCount.set(k, (attrCount.get(k) ?? 0) + 1);
      for (const seg of c) { const form = seg.replace(/\d+[A-Z]?(-\d+)?(\.\d+[a-z]?)?/g, 'N').replace(/\([a-zA-Z0-9]+\)/g, '(x)'); pathForms.set(form, (pathForms.get(form) ?? 0) + 1); }
      if (ex.length < 12 && n.attribs.path) ex.push(`${f}: chain=${c.join(' > ')} op=${n.name} ${JSON.stringify(n.attribs)}`);
    }
    for (const ch of n.children) walk(ch, c);
  };
  for (const ch of doc.children) walk(ch, []);
}
console.log('ops', ops);
console.log([...attrCount].sort((a, b) => b[1] - a[1]).slice(0, 25).map(([k, v]) => `${v}\t${k}`).join('\n'));
console.log('--- path segment forms');
console.log([...pathForms].sort((a, b) => b[1] - a[1]).slice(0, 25).map(([k, v]) => `${v}\t${k}`).join('\n'));
console.log(ex.join('\n'));
