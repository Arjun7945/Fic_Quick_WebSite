import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { isSpecialDrop, SPECIAL_DROP_SLUGS, SPECIAL_DROP_TAG } from '../../src/lib/specialDrops.ts';
import { getColorName, getColorKeyword } from '../../src/lib/colors.ts';
import fs from 'node:fs';
import path from 'node:path';

describe('Special Drops & Catalog Enhancements', () => {
  test('correctly identifies Ronaldo and Messi Legend Oversized T-Shirts as special drops', () => {
    assert.strictEqual(SPECIAL_DROP_TAG, 'Ficcado Special Drops');
    assert.strictEqual(SPECIAL_DROP_SLUGS.size, 2);
    assert.ok(isSpecialDrop('Ficcado Ronaldo Legend Oversized T-Shirt'));
    assert.ok(isSpecialDrop('Ficcado Messi Legend Oversized T-Shirt'));
    assert.ok(isSpecialDrop({ name: 'Ficcado Ronaldo Legend Oversized T-Shirt', slug: 'ficcado-ronaldo-legend-oversized-t-shirt' }));
    assert.ok(isSpecialDrop({ name: 'Ficcado Messi Legend Oversized T-Shirt', slug: 'ficcado-messi-legend-oversized-t-shirt' }));
    assert.ok(isSpecialDrop('ficcado-ronaldo-legend-oversized-t-shirt'));
    assert.ok(isSpecialDrop('ficcado-messi-legend-oversized-t-shirt'));
  });

  test('does not classify standard items as special drops', () => {
    assert.strictEqual(isSpecialDrop('Holiday Edition Starburst'), false);
    assert.strictEqual(isSpecialDrop('Christmas Winter Glow Tee'), false);
    assert.strictEqual(isSpecialDrop('Christmas Chronicles Tee'), false);
    assert.strictEqual(isSpecialDrop('CHOSEN'), false);
    assert.strictEqual(isSpecialDrop('GROUNDED'), false);
    assert.strictEqual(isSpecialDrop(null), false);
  });

  test('supports Forest Green and Off-White in color utilities', () => {
    assert.strictEqual(getColorName('#1b4332'), 'Forest Green');
    assert.strictEqual(getColorName('#f5f5f0'), 'Off-White');
    assert.strictEqual(getColorKeyword('#1b4332'), 'green');
    assert.strictEqual(getColorKeyword('#f5f5f0'), 'white');
  });

  test('ensures all 16 item directories exist in public/images/items with valid images', () => {
    const itemsDir = path.resolve(process.cwd(), 'public/images/items');
    const requiredSlugs = [
      'ficcado-ronaldo-legend-oversized-t-shirt',
      'ficcado-messi-legend-oversized-t-shirt',
      'holiday-edition-starburst',
      'christmas-winter-glow-tee',
      'christmas-chronicles-tee',
      'chosen',
      'grounded',
      'remember',
      'reminder',
      'echoes-of-the-empire',
      'frame-the-bloom',
      'silent-sentinel',
      'the-watchers',
      'plain-black',
      'plain-white',
      'plain-blue',
    ];

    for (const slug of requiredSlugs) {
      const folderPath = path.join(itemsDir, slug);
      assert.ok(fs.existsSync(folderPath), `Folder missing: ${folderPath}`);
      const files = fs.readdirSync(folderPath).filter(f => !f.endsWith('.md'));
      assert.ok(files.length > 0, `Folder empty: ${folderPath}`);
    }
  });

  test('verifies products snapshot or catalog items have 16 baked items with correct sort ordering', () => {
    const snapshotPath = path.resolve(process.cwd(), 'src/generated/products-snapshot.json');
    if (fs.existsSync(snapshotPath)) {
      const content = fs.readFileSync(snapshotPath, 'utf8').trim();
      if (content && content !== '[]') {
        const items = JSON.parse(content);
        assert.strictEqual(items.length, 16, 'Expected 16 items in products snapshot');

        assert.strictEqual(items[0].slug, 'ficcado-ronaldo-legend-oversized-t-shirt');
        assert.strictEqual(items[0].price, 1299);
        assert.strictEqual(items[0].sort_order, 1);

        assert.strictEqual(items[1].slug, 'ficcado-messi-legend-oversized-t-shirt');
        assert.strictEqual(items[1].price, 1299);
        assert.strictEqual(items[1].sort_order, 2);

        assert.strictEqual(items[2].slug, 'holiday-edition-starburst');
        assert.strictEqual(items[2].price, 899);
        assert.strictEqual(items[2].sort_order, 3);

        assert.strictEqual(items[3].slug, 'christmas-winter-glow-tee');
        assert.strictEqual(items[3].price, 899);
        assert.strictEqual(items[3].sort_order, 4);

        assert.strictEqual(items[4].slug, 'christmas-chronicles-tee');
        assert.strictEqual(items[4].price, 899);
        assert.strictEqual(items[4].sort_order, 5);

        // Plain tees at the end (positions 13, 14, 15 - 0-indexed)
        assert.strictEqual(items[13].slug, 'plain-black');
        assert.strictEqual(items[13].price, 999);
        assert.strictEqual(items[13].sort_order, 14);

        assert.strictEqual(items[14].slug, 'plain-white');
        assert.strictEqual(items[14].price, 999);
        assert.strictEqual(items[14].sort_order, 15);

        assert.strictEqual(items[15].slug, 'plain-blue');
        assert.strictEqual(items[15].price, 999);
        assert.strictEqual(items[15].sort_order, 16);
        return;
      }
    }

    // In CI or environments where prebuild snapshot is not yet generated, verify generated item images manifest has all 16 items
    const manifestPath = path.resolve(process.cwd(), 'src/generated/item-images.json');
    assert.ok(fs.existsSync(manifestPath), 'Item images manifest must exist');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const manifestKeys = Object.keys(manifest);
    assert.strictEqual(manifestKeys.length, 16, 'Item image manifest must contain 16 items');
    assert.ok(manifestKeys.includes('ficcado-ronaldo-legend-oversized-t-shirt'));
    assert.ok(manifestKeys.includes('ficcado-messi-legend-oversized-t-shirt'));
    assert.ok(manifestKeys.includes('plain-black'));
    assert.ok(manifestKeys.includes('plain-white'));
    assert.ok(manifestKeys.includes('plain-blue'));
  });
});
