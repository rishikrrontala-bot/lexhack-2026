import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { lawFromXml, codeSectionFromXml } from './lib/dcxml';
const read = (name: string) => readFileSync(`data/source/${name}`, 'utf8');
const law = lawFromXml(read('law-25-108.xml'));
const before = codeSectionFromXml(read('code-38-501-before.xml'));
const after = codeSectionFromXml(read('code-38-501-after.xml'));
mkdirSync('src/data', { recursive: true });
writeFileSync('src/data/example.json', JSON.stringify({
  law: { id: law.id, title: law.shortTitle, effective: law.effective, text: law.text, url: 'https://code.dccouncil.gov/us/dc/council/laws/25-108' },
  section: { id: '38-501', url: 'https://code.dccouncil.gov/us/dc/council/code/sections/38-501', before, after,
    beforePublication: '2023-12-11', afterPublication: '2024-02-08' }
}, null, 2));
console.log('Built one reproducible D.C. law and Code replay fixture.');
