import test from 'node:test';
import assert from 'node:assert/strict';
import { auditText, SAMPLE } from './audit.js';

test('sample catches two conflicts, supports two narrow claims, abstains once', () => {
  assert.deepEqual(auditText(SAMPLE).map(x => x.status), ['conflict', 'aligned', 'conflict', 'aligned', 'review']);
});
test('unknown claim abstains', () => assert.equal(auditText('My bank must forgive every loan.')[0].status, 'review'));
test('input is capped at 30 claims', () => assert.equal(auditText(Array(40).fill('A claim.').join('\n')).length, 30));
