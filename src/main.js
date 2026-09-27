import { SAMPLE, auditText } from './audit.js';

const input = document.querySelector('#answer');
const results = document.querySelector('#results');
const count = document.querySelector('#count');
const empty = document.querySelector('#empty');
const sample = document.querySelector('#sample');
const audit = document.querySelector('#audit');

sample.addEventListener('click', () => { input.value = SAMPLE; input.focus(); });
audit.addEventListener('click', () => {
  const claims = auditText(input.value);
  results.replaceChildren();
  empty.hidden = claims.length > 0;
  count.textContent = claims.length ? `${claims.length} claims inspected · ${claims.filter(x => x.status === 'conflict').length} conflicts flagged · ${claims.filter(x => x.status === 'review').length} need review` : 'No claims yet';
  for (const [i, item] of claims.entries()) {
    const row = document.createElement('article'); row.className = `finding ${item.status}`;
    const head = document.createElement('div'); head.className = 'finding-head';
    const index = document.createElement('span'); index.textContent = String(i + 1).padStart(2, '0');
    const badge = document.createElement('strong'); badge.textContent = {conflict:'Contradicts source', aligned:'Consistent on this point', review:'Needs human review'}[item.status];
    head.append(index, badge);
    const quote = document.createElement('blockquote'); quote.textContent = item.claim;
    const reason = document.createElement('p'); reason.textContent = item.reason;
    row.append(head, quote, reason);
    if (item.source) {
      const source = document.createElement('div'); source.className = 'source';
      const link = document.createElement('a'); link.href = item.source.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = `${item.source.label} ↗`;
      const summary = document.createElement('span'); summary.textContent = item.source.summary;
      source.append(link, summary); row.append(source);
    }
    results.append(row);
  }
  results.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'start'});
});
