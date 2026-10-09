// =============================================================================
// Netlify Config & Security Headers Test Suite — scripts/tests/netlify-config.test.mjs
// Verifies single netlify.toml at root and compliance with D13 header policies
// =============================================================================

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Netlify Configuration & Security Headers per D13 & Item 6', () => {
  const rootDir = path.resolve(process.cwd(), '..');
  const rootToml = path.join(rootDir, 'netlify.toml');
  const nestedToml = path.join(process.cwd(), 'netlify.toml');

  test('enforces single netlify.toml at repository root', () => {
    assert.ok(fs.existsSync(rootToml), 'Root netlify.toml must exist');
    assert.strictEqual(fs.existsSync(nestedToml), false, 'Nested netlify.toml must NOT exist');
  });

  test('validates headers in root netlify.toml per D13', () => {
    const content = fs.readFileSync(rootToml, 'utf8');

    // CSP Report-Only is present
    assert.ok(
      content.includes('Content-Security-Policy-Report-Only'),
      'Content-Security-Policy-Report-Only must be configured'
    );

    // Deprecated X-XSS-Protection is removed
    assert.strictEqual(
      content.includes('X-XSS-Protection'),
      false,
      'X-XSS-Protection must be removed per D13'
    );

    // HSTS max-age=31536000 is present without preload/includeSubDomains
    assert.ok(
      content.includes('Strict-Transport-Security = "max-age=31536000"'),
      'HSTS max-age=31536000 must be set'
    );
    assert.strictEqual(
      content.includes('includeSubDomains'),
      false,
      'includeSubDomains must be omitted per D13 unless confirmed'
    );
    assert.strictEqual(
      content.includes('preload'),
      false,
      'preload must be omitted per D13 unless confirmed'
    );

    // Cache-Control no-store for /api/orders and /api/inquiry
    assert.ok(
      content.includes('for = "/api/orders"'),
      'Must contain headers for /api/orders'
    );
    assert.ok(
      content.includes('for = "/api/inquiry"'),
      'Must contain headers for /api/inquiry'
    );
    assert.ok(
      content.includes('no-store'),
      'Must specify no-store for POST APIs'
    );
  });
});
