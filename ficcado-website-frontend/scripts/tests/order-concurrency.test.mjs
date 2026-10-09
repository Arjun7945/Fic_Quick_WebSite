import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import { dispatchOrder } from '../../src/lib/orderGateway.ts';
import { isValidReferenceId } from '../../src/lib/referenceId.ts';

describe('Order Flow & Concurrency Verification per D1', () => {
  let server;
  let serverPort;
  let serverUrl;
  let counter = 1000;
  const processedSubmissions = new Map();

  before(async () => {
    // Fake Google Apps Script Web App Gateway
    server = http.createServer((req, res) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body);
          if (payload.secret !== 'test-secret') {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
          }

          const subId = payload.submission_id;
          if (processedSubmissions.has(subId)) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(
              JSON.stringify({
                success: true,
                referenceId: processedSubmissions.get(subId),
                duplicate: true,
              })
            );
          }

          // Atomic increment
          counter++;
          const refId = `FIC-A${counter}`;
          processedSubmissions.set(subId, refId);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              success: true,
              referenceId: refId,
              duplicate: false,
            })
          );
        } catch {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Internal Error' }));
        }
      });
    });

    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        serverPort = server.address().port;
        serverUrl = `http://127.0.0.1:${serverPort}`;
        process.env.ORDER_GATEWAY_URL = serverUrl;
        process.env.ORDER_GATEWAY_SECRET = 'test-secret';
        resolve();
      });
    });
  });

  after(async () => {
    delete process.env.ORDER_GATEWAY_URL;
    delete process.env.ORDER_GATEWAY_SECRET;
    await new Promise((resolve) => server.close(resolve));
  });

  test('20 parallel requests against gateway produce 20 strictly unique Reference IDs', async () => {
    const parallelCount = 20;
    const promises = [];

    for (let i = 0; i < parallelCount; i++) {
      const subId = `parallel_sub_${i}_${Date.now()}`;
      const dummyRow = {
        submission_id: subId,
        customer_name: `Customer ${i}`,
        customer_email: `customer${i}@example.com`,
        customer_phone: '9876543210',
        address_line1: '123 Street',
        address_line2: '',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        landmark: '',
        courier_partner_id: 'standard',
        courier_partner_name: 'Standard Courier',
        delivery_charge: 50,
        subtotal: 999,
        total_amount: 1049,
        item_count: 1,
        items_summary: 'Test Tee',
        items_json: '[]',
        created_at: '06 Oct 2026, 03:00 PM',
        status: 'NEW',
      };

      promises.push(dispatchOrder(subId, dummyRow));
    }

    const results = await Promise.all(promises);
    assert.strictEqual(results.length, parallelCount, 'Must process all 20 orders');

    const refIds = results.map((r) => r.referenceId);
    const uniqueRefIds = new Set(refIds);

    assert.strictEqual(uniqueRefIds.size, parallelCount, 'All 20 Reference IDs must be strictly unique');

    for (const res of results) {
      assert.strictEqual(res.isDuplicate, false, 'Initial orders must not be marked duplicate');
      assert.strictEqual(res.mode, 'gateway', 'Must use gateway mode');
      assert.ok(isValidReferenceId(res.referenceId), `Reference ID ${res.referenceId} must be valid`);
    }
  });

  test('Identical submission_id returns duplicate=true with same Reference ID', async () => {
    const subId = `idempotent_sub_${Date.now()}`;
    const dummyRow = {
      submission_id: subId,
      customer_name: 'Duplicate Test',
      customer_email: 'dup@example.com',
      customer_phone: '9876543210',
      address_line1: '123 Street',
      address_line2: '',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      landmark: '',
      courier_partner_id: 'standard',
      courier_partner_name: 'Standard Courier',
      delivery_charge: 50,
      subtotal: 999,
      total_amount: 1049,
      item_count: 1,
      items_summary: 'Test Tee',
      items_json: '[]',
      created_at: '06 Oct 2026, 03:00 PM',
      status: 'NEW',
    };

    const first = await dispatchOrder(subId, dummyRow);
    const second = await dispatchOrder(subId, dummyRow);

    assert.strictEqual(first.referenceId, second.referenceId, 'Both calls must return identical Reference ID');
    assert.strictEqual(first.isDuplicate, false, 'First call is not duplicate');
    assert.strictEqual(second.isDuplicate, true, 'Second call must be flagged duplicate');
  });

  test('Gateway outage falls back cleanly to cryptographic offline FIC-T Reference ID', async () => {
    // Point gateway to nonexistent port
    process.env.ORDER_GATEWAY_URL = 'http://127.0.0.1:54321';

    const subId = `offline_sub_${Date.now()}`;
    const dummyRow = {
      submission_id: subId,
      customer_name: 'Offline Test',
      customer_email: 'off@example.com',
      customer_phone: '9876543210',
      address_line1: '123 Street',
      address_line2: '',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      landmark: '',
      courier_partner_id: 'standard',
      courier_partner_name: 'Standard Courier',
      delivery_charge: 50,
      subtotal: 999,
      total_amount: 1049,
      item_count: 1,
      items_summary: 'Test Tee',
      items_json: '[]',
      created_at: '06 Oct 2026, 03:00 PM',
      status: 'NEW',
    };

    const res = await dispatchOrder(subId, dummyRow);
    assert.strictEqual(res.isOffline, true, 'Must indicate offline fallback');
    assert.strictEqual(res.mode, 'offline');
    assert.ok(res.referenceId.startsWith('FIC-T'), `Fallback ID ${res.referenceId} must start with FIC-T`);
    assert.ok(isValidReferenceId(res.referenceId), `Fallback ID ${res.referenceId} must be valid format`);

    // Restore correct gateway
    process.env.ORDER_GATEWAY_URL = serverUrl;
  });
});
