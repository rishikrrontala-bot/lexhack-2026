export const SOURCES = {
  hours: { label: '15 U.S.C. § 1692c(a)(1)', url: 'https://uscode.house.gov/view.xhtml?edition=prelim&path=%2Fprelim%40title15%2Fchapter41%2Fsubchapter5', summary: 'Without prior consent or court permission, a debt collector generally may not contact a consumer at an unusual or inconvenient time. The default window is after 8 AM and before 9 PM local time.' },
  notice: { label: '15 U.S.C. § 1692g(a)', url: 'https://uscode.house.gov/view.xhtml?edition=prelim&path=%2Fprelim%40title15%2Fchapter41%2Fsubchapter5', summary: 'A collector generally must provide validation information within five days of initial contact, unless the initial communication included it or the debt was paid.' },
  dispute: { label: '15 U.S.C. § 1692g(a)(3)–(4)', url: 'https://uscode.house.gov/view.xhtml?edition=prelim&path=%2Fprelim%40title15%2Fchapter41%2Fsubchapter5', summary: 'The notice must describe a 30-day period after receipt to dispute the debt. A timely written dispute triggers verification duties.' },
  pause: { label: '15 U.S.C. § 1692g(b)', url: 'https://uscode.house.gov/view.xhtml?edition=prelim&path=%2Fprelim%40title15%2Fchapter41%2Fsubchapter5', summary: 'After a timely written dispute, collection of the disputed debt must pause until verification or a judgment copy is mailed.' }
};

export const SAMPLE = `Debt collectors can call you at 6 AM if they choose.
Collectors must send validation information within five days of first contact.
You only have seven days to dispute the debt after receiving the notice.
If you dispute in writing within 30 days, collection must pause until verification is mailed.
A court will always erase the debt if you ask.`;

export function splitClaims(text) {
  return text.split(/\n+|(?<=[.!?])\s+(?=[A-Z])/).map(x => x.trim()).filter(Boolean).slice(0, 30);
}

function finding(claim, status, sourceKey, reason) {
  return { claim, status, source: sourceKey ? SOURCES[sourceKey] : null, reason };
}

export function auditClaim(claim) {
  const s = claim.toLowerCase().replace(/a\.m\./g, 'am').replace(/p\.m\./g, 'pm');
  const collector = /collector|collection agency/.test(s);
  if (!collector && !/debt|dispute|validation/.test(s)) return finding(claim, 'review', null, 'Outside this tool’s four-rule scope.');

  if (collector && /call|contact|communicat/.test(s) && /6\s*am|7\s*am|before\s*8\s*am|after\s*9\s*pm|midnight|any\s*time|24\/7/.test(s)) {
    if (/cannot|can't|may not|must not|prohibit|not allowed/.test(s)) return finding(claim, 'aligned', 'hours', 'This matches the general time restriction, though consent and other facts may change the analysis.');
    if (/can|may|allow|permitted/.test(s)) return finding(claim, 'conflict', 'hours', 'This gives permission at a time the federal rule generally restricts.');
  }

  if (/validation|notice/.test(s) && /five days|5 days/.test(s) && /send|provide|give/.test(s)) {
    if (/not|required to|don't|doesn't/.test(s) && /not|don't|doesn't/.test(s)) return finding(claim, 'review', 'notice', 'The wording is ambiguous; check the source directly.');
    return finding(claim, 'aligned', 'notice', 'The five-day rule is broadly consistent; the initial-contact and paid-debt exceptions matter.');
  }

  if (/dispute/.test(s) && /seven days|7 days|ten days|10 days/.test(s)) return finding(claim, 'conflict', 'dispute', 'The federal validation notice describes a 30-day window after receipt, not this shorter period.');
  if (/dispute/.test(s) && /30 days|thirty days/.test(s) && !/pause|stop|cease/.test(s)) return finding(claim, 'aligned', 'dispute', 'This matches the 30-day window described in the validation notice.');
  if (/dispute/.test(s) && /writing|written/.test(s) && /pause|stop|cease/.test(s) && /verif/.test(s)) {
    if (/does not|doesn't|need not|won't/.test(s)) return finding(claim, 'conflict', 'pause', 'A timely written dispute generally requires a pause until verification is mailed.');
    return finding(claim, 'aligned', 'pause', 'This is consistent with the rule for a timely written dispute.');
  }
  return finding(claim, 'review', null, 'No rule in the curated set can reliably decide this claim. Verify it with a qualified source.');
}

export function auditText(text) { return splitClaims(text).map(auditClaim); }
