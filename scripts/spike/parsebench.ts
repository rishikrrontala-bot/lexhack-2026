import { readFileSync, readdirSync } from 'node:fs';
import { lawFromXml } from '../lib/dcxml';
import { compile } from '../../src/engine/compile';
import { goldSigs, instrSigs, isInstructional, type Kind } from '../lib/signature';
const periods = (process.argv[2] ?? '23,24,25,26').split(',');
const root = 'data-cache/law-xml/us/dc/council/periods';
const tot: Record<string, { gold: number; hit: number; ours: number; oursHit: number }> = {};
const miss: string[] = []; const extra: string[] = [];
let laws = 0;
for (const p of periods) for (const f of readdirSync(`${root}/${p}/laws`)) {
  let law; try { law = lawFromXml(readFileSync(`${root}/${p}/laws/${f}`, 'utf8')); } catch { continue; }
  if (law.temporary || law.emergency) continue;
  const gold = law.gold.filter((g) => (g.section || g.kind === 'insert') && isInstructional(g));
  if (!gold.length) continue;
  laws++;
  let res; try { res = compile(law.text); } catch (e) { console.error(f, e); continue; }
  const g = gold.flatMap((x) => goldSigs(x).map((s) => ({ ...s, src: x })));
  const o = res.instructions.flatMap((x) => instrSigs(x).map((s) => ({ ...s, src: x })));
  const pool = new Map<string, number>();
  for (const s of o) pool.set(s.key, (pool.get(s.key) ?? 0) + 1);
  const gpool = new Map<string, number>();
  for (const s of g) gpool.set(s.key, (gpool.get(s.key) ?? 0) + 1);
  for (const s of g) {
    const t = (tot[s.kind] ??= { gold: 0, hit: 0, ours: 0, oursHit: 0 }); t.gold++;
    const c = pool.get(s.key) ?? 0; if (c > 0) { t.hit++; pool.set(s.key, c - 1); } else if (miss.length < 4000) miss.push(`${law.law} ${s.key} :: ${s.src.instruction.slice(0, 160)}`);
  }
  for (const s of o) {
    const t = (tot[s.kind] ??= { gold: 0, hit: 0, ours: 0, oursHit: 0 }); t.ours++;
    const c = gpool.get(s.key) ?? 0; if (c > 0) { t.oursHit++; gpool.set(s.key, c - 1); } else if (extra.length < 4000) extra.push(`${law.law} ${s.key} :: ${s.src.source.sentence.slice(0, 160)}`);
  }
}
console.log('laws', laws);
let G = 0, H = 0, O = 0, OH = 0;
for (const [k, v] of Object.entries(tot)) { console.log(k.padEnd(14), `recall ${(v.hit / v.gold * 100).toFixed(1)}% (${v.hit}/${v.gold})  precision ${(v.oursHit / Math.max(1, v.ours) * 100).toFixed(1)}% (${v.oursHit}/${v.ours})`); G += v.gold; H += v.hit; O += v.ours; OH += v.oursHit; }
console.log('ALL'.padEnd(14), `recall ${(H / G * 100).toFixed(1)}% precision ${(OH / O * 100).toFixed(1)}%`);
import { writeFileSync } from 'node:fs';
writeFileSync('/tmp/spike/miss.txt', miss.join('\n')); writeFileSync('/tmp/spike/extra.txt', extra.join('\n'));
