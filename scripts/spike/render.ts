import { readFileSync } from 'node:fs';
import { lawFromXml, codeSectionFromXml } from '../lib/dcxml';
const law = lawFromXml(readFileSync('data-cache/law-xml/us/dc/council/periods/25/laws/25-108.xml', 'utf8'));
console.log(law.id, law.shortTitle, law.effective, law.temporary, law.limsUrl);
console.log(law.text.slice(0, 2500));
console.log(JSON.stringify(law.gold.slice(0, 6), null, 1).slice(0, 2500));
const s = codeSectionFromXml(readFileSync('data-cache/codified/us/dc/council/code/titles/38/sections/38-501.xml', 'utf8'));
console.log(JSON.stringify(s).slice(0, 600));
