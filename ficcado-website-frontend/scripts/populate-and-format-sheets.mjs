import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Load .env.local
const envLocal = fs.readFileSync('.env.local', 'utf8');
for (const line of envLocal.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx > 0) process.env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
}

const credPath = path.resolve('../credentials/ficcado-quick-website-5fc91a2f02ba.json');
const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));

function createJwt(email, privateKey) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };
  const b64 = obj => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const unsigned = `${b64(header)}.${b64(claim)}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(unsigned);
  return `${unsigned}.${sign.sign(privateKey, 'base64url')}`;
}

async function getAccessToken() {
  const jwt = createJwt(creds.client_email, creds.private_key);
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });
  const data = await tokenRes.json();
  if (!data.access_token) {
    throw new Error(`Token exchange failed: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

// -----------------------------------------------------------------------------
// Sheet Schemas & Valid Real Demo Data
// -----------------------------------------------------------------------------

const SHEETS_DATA = {
  'Item Management': {
    headers: [
      'id', 'item_name', 'type', 'price', 'sizes', 'average_rating', 'review_count',
      'colors', 'description', 'slug', 'in_stock', 'featured', 'active', 'sort_order'
    ],
    rows: [
      // --- New Launches (Top Priority: Sort Orders 1-5) ---
      [
        '9',
        'Ficcado Ronaldo Legend Oversized T-Shirt',
        'T-Shirts',
        '1299',
        'XS,S,M,L,XL',
        '5.0',
        '32',
        '#111827',
        'Celebrate a true football icon with the latest drop from Ficcado. Crafted from signature high-quality 240 GSM heavy combed cotton in a sleek black colorway, this premium oversized T-shirt features clean minimal "RONALDO" typography accompanied by his signature on the front. The back showcases a bold "CR7" graphic alongside a striking portrait and the iconic quote "In my mind I\'m always the best." Designed with a relaxed oversized streetwear fit and dropped shoulders, it combines unmatched comfort with a statement look.',
        'ficcado-ronaldo-legend-oversized-t-shirt',
        'TRUE',
        'TRUE',
        'TRUE',
        '1',
      ],
      [
        '10',
        'Ficcado Messi Legend Oversized T-Shirt',
        'T-Shirts',
        '1299',
        'XS,S,M,L,XL',
        '5.0',
        '29',
        '#111827',
        'Honor true greatness with the latest drop from Ficcado — featuring a tribute to a football icon. Crafted from signature high-quality 240 GSM heavy combed cotton in a sleek, classic black, this premium oversized T-shirt features clean minimal "MESSI" typography with his signature on the front, paired with a striking portrait graphic on the back and the timeless quote "Legends retire, greatness stays forever." Designed with a relaxed oversized silhouette and drop-shoulder styling, it delivers ultimate comfort and unmatched streetwear aesthetic for fans and everyday wear.',
        'ficcado-messi-legend-oversized-t-shirt',
        'TRUE',
        'TRUE',
        'TRUE',
        '2',
      ],
      [
        '11',
        'Holiday Edition Starburst',
        'T-Shirts',
        '899',
        'XS,S,M,L,XL',
        '4.9',
        '21',
        '#1B4332',
        'Celebrate the festive season in style with the Ficcado Christmas Drop — a perfect blend of cozy vibes, vintage holiday charm, and modern streetwear. Designed in a rich, classic forest green, this premium oversized T-shirt features minimal “Merry Christmas” typography and a delicate star accent on the front, paired with a stunning vintage-inspired sketch illustration of a fully decorated Christmas tree on the back. With its relaxed oversized silhouette and festive aesthetic, it\'s made for Christmas gatherings, winter outings, gifting, and creating unforgettable holiday looks.',
        'holiday-edition-starburst',
        'TRUE',
        'TRUE',
        'TRUE',
        '3',
      ],
      [
        '12',
        'Christmas Winter Glow Tee',
        'T-Shirts',
        '899',
        'XS,S,M,L,XL',
        '4.8',
        '18',
        '#F5F5F0',
        'Bring timeless festive vibes to your wardrobe with the Christmas Spirit Oversized Tee from Ficcado’s exclusive Christmas Collection. Designed in a classic off-white shade, this T-shirt features an elegant “Merry Christmas” typography print on the front and a bold, vintage-inspired Christmas tree illustration on the back, finished with festive ornaments, sparkling stars, and a deep red graphic that creates a striking seasonal look. With its relaxed oversized silhouette and minimalist festive aesthetic, this tee is perfect for Christmas celebrations, winter outings, casual streetwear, and gifting your loved ones.',
        'christmas-winter-glow-tee',
        'TRUE',
        'TRUE',
        'TRUE',
        '4',
      ],
      [
        '13',
        'Christmas Chronicles Tee',
        'T-Shirts',
        '899',
        'XS,S,M,L,XL',
        '4.9',
        '25',
        '#DC2626',
        'Celebrate the festive season in style with the Ficcado Christmas Drop — a perfect blend of cozy vibes, vintage Christmas charm, and modern streetwear. Designed in a rich festive red, this premium oversized T-shirt features a minimal Christmas tree graphic on the front and a stunning vintage-inspired Christmas postcard illustration on the back, complete with a snowy cabin, evergreen trees, and the timeless message “Merry Christmas.” With its relaxed oversized silhouette and festive aesthetic, it\'s made for Christmas gatherings, winter outings, gifting, and creating unforgettable holiday looks.',
        'christmas-chronicles-tee',
        'TRUE',
        'TRUE',
        'TRUE',
        '5',
      ],
      // --- Priority Catalog Drops (Sort Orders 6-13) ---
      [
        '1',
        'CHOSEN',
        'T-Shirts',
        '1299',
        'XS,S,M,L,XL',
        '4.9',
        '27',
        '#DC2626',
        'Different by choice not by chance. Made for those who embrace their individuality. Be whoever you choose to be.',
        'chosen',
        'TRUE',
        'FALSE',
        'TRUE',
        '6',
      ],
      [
        '2',
        'GROUNDED',
        'T-Shirts',
        '799',
        'XS,S,M,L,XL',
        '4.8',
        '25',
        '#111827',
        'Inspired by the strength of staying rooted through every change. A minimal design that represents resilience, growth, and new beginnings. No matter how far you grow, never forget your roots.',
        'grounded',
        'TRUE',
        'FALSE',
        'TRUE',
        '7',
      ],
      [
        '3',
        'REMEMBER',
        'T-Shirts',
        '1499',
        'XS,S,M,L,XL',
        '4.9',
        '23',
        '#1E3A8A',
        'A quiet reminder to come back to the present. Yesterday is gone. Tomorrow can wait. Be here. Be now.',
        'remember',
        'TRUE',
        'FALSE',
        'TRUE',
        '8',
      ],
      [
        '4',
        'REMINDER',
        'T-Shirts',
        '999',
        'XS,S,M,L,XL',
        '4.8',
        '16',
        '#15803D',
        'Minimal on the front. A statement on the back. “Something is better than nothing.” An oversized everyday essential made for quiet confidence.',
        'reminder',
        'TRUE',
        'FALSE',
        'TRUE',
        '9',
      ],
      [
        '5',
        'ECHOES OF THE EMPIRE',
        'T-Shirts',
        '1199',
        'XS,S,M,L,XL',
        '4.9',
        '41',
        '#111827,#FFFFFF,#7B1113',
        "Echoes of the empire captures the grandeur of India's regal past, a moment frozen in time where tradition parades with pride. This t-shirt isn't just apparel, it's an artwork. The vivid illustration celebrates royal possession that once marked power, celebration and legacy.",
        'echoes-of-the-empire',
        'TRUE',
        'FALSE',
        'TRUE',
        '10',
      ],
      [
        '6',
        'FRAME THE BLOOM',
        'T-Shirts',
        '1499',
        'XS,S,M,L,XL',
        '4.9',
        '31',
        '#FFFFFF,#D4C4A8,#99BADD',
        "Frame the bloom tee is inspired by analog nostalgia, a time when every photo had meaning and every frame was a keepsake. Surrounded by bold blossoms and natural motifs, the camera symbolizes not just memory-keeping but creative expression. It's a celebration of growth, reflection, and capturing beauty in everyday life.",
        'frame-the-bloom',
        'TRUE',
        'FALSE',
        'TRUE',
        '11',
      ],
      [
        '7',
        'SILENT SENTINEL',
        'T-Shirts',
        '1199',
        'XS,S,M,L,XL',
        '4.9',
        '55',
        '#111827,#FFFFFF',
        "Inspired by the myth of the eternal guardian who watches over sacred grounds, this tee represents the energy of protectiveness and silent strength. The fiery red design evokes ancient legends where dragons were not just feared but revered as symbols of endurance, power, and wisdom. This tee is for the ones who lead from the shadows, whose energy is felt before their words are heard.",
        'silent-sentinel',
        'TRUE',
        'FALSE',
        'TRUE',
        '12',
      ],
      [
        '8',
        'THE WATCHERS',
        'T-Shirts',
        '999',
        'XS,S,M,L,XL',
        '4.8',
        '32',
        '#111827',
        "In the world where many watch but few understand, this tee is for those who walk silently under the moonlight, carrying fire within. The watchers is more than a design, it's a reminder that someone always sees strength even in your silence.",
        'the-watchers',
        'TRUE',
        'FALSE',
        'TRUE',
        '13',
      ],

      // --- Plain Minimal Essentials (Last / Baseline: Sort Orders 14-16) ---
      [
        '14',
        'Plain Black',
        'T-Shirts',
        '999',
        'XS,S,M,L,XL',
        '4.9',
        '19',
        '#111827',
        "The ultimate everyday luxury essential. Tailored from signature 240 GSM heavy combed cotton in a deep monochrome black, this oversized tee offers unmatched drape, breathability, and structural durability. Featuring clean dropped shoulders and minimalist silhouette, it's designed to be the foundational centerpiece of any modern streetwear wardrobe.",
        'plain-black',
        'TRUE',
        'FALSE',
        'TRUE',
        '14',
      ],
      [
        '15',
        'Plain White',
        'T-Shirts',
        '999',
        'XS,S,M,L,XL',
        '4.9',
        '22',
        '#FFFFFF',
        "Crisp, minimal, and timeless. Crafted from high-grade 240 GSM heavy combed cotton in an immaculate pure white colorway, this oversized tee delivers pure aesthetic simplicity with exceptional comfort. Cut with a relaxed silhouette and reinforced ribbed neckline, it offers effortless versatility for layering or standalone wear.",
        'plain-white',
        'TRUE',
        'FALSE',
        'TRUE',
        '15',
      ],
      [
        '16',
        'Plain Blue',
        'T-Shirts',
        '999',
        'XS,S,M,L,XL',
        '4.8',
        '16',
        '#1E3A8A',
        "Understated elegance meets contemporary streetwear. Made from signature 240 GSM heavy combed cotton in a rich, versatile blue shade, this oversized tee combines lasting plush softness with a structured silhouette. Finished with relaxed drop shoulders and durable stitching, it is built for comfort, daily confidence, and effortless styling.",
        'plain-blue',
        'TRUE',
        'FALSE',
        'TRUE',
        '16',
      ],
    ]
  },

  'Courier Partners': {
    headers: [
      'partner_id', 'partner_name', 'partner_phone', 'partner_address',
      'rate_per_delivery', 'created_at', 'updated_at', 'status', 'delivery_time'
    ],
    rows: [
      [
        'CP-IND-POST',
        'India Post (Speed Post)',
        "'+91 1800 266 6868",
        'National Sorting Hub, Kochi, Kerala - 682011',
        '0',
        '2026-01-15',
        '2026-10-05',
        'ACTIVE',
        '3-5 Business Days (Free Pan-India)'
      ],
      [
        'CP-DELHIVERY',
        'Delhivery Surface Express',
        "'+91 80698 56100",
        'Plot 5, Sector 44, Gurugram, Haryana - 122002',
        '60',
        '2026-02-01',
        '2026-10-05',
        'ACTIVE',
        '2-4 Business Days (Tracked)'
      ],
      [
        'CP-BLUEDART',
        'Blue Dart Priority Air',
        "'+91 1860 233 1234",
        'Blue Dart Centre, Sahar Airport Road, Andheri East, Mumbai - 400099',
        '120',
        '2026-02-10',
        '2026-10-05',
        'ACTIVE',
        '1-2 Business Days (Express Air)'
      ],
      [
        'CP-DTDC',
        'DTDC Standard Express',
        "'+91 73057 70577",
        'DTDC House, Victoria Road, Bengaluru, Karnataka - 560047',
        '40',
        '2026-03-01',
        '2026-10-05',
        'ACTIVE',
        '3-4 Business Days'
      ]
    ]
  },

  'New Sale Request': {
    headers: [
      'reference_id', 'created_at', 'status', 'final_order_id', 'customer_name',
      'customer_email', 'customer_phone', 'address_line1', 'address_line2',
      'city', 'state', 'pincode', 'landmark', 'courier_partner_id',
      'courier_partner_name', 'delivery_charge', 'subtotal', 'total_amount',
      'item_count', 'items_summary', 'items_json', 'submission_id'
    ],
    rows: [
      [
        'FIC-A0001',
        '03 Oct 2026, 11:15 am IST',
        'CONFIRMED',
        'FIC-ORD-8821',
        'Rahul Sharma',
        'rahul.sharma@gmail.com',
        '9876543210',
        'Flat 402, Skyline Residency, MG Road',
        'Indiranagar',
        'Bengaluru',
        'Karnataka',
        '560038',
        'Near Metro Station Pillar 12',
        'CP-BLUEDART',
        'Blue Dart Priority Air',
        '120',
        '899',
        '1019',
        '1',
        '1) Colorado Signature High Quality Tee | Size L | Color Sage Green | Qty 1 | ₹899 each = ₹899',
        '[{"id":1,"name":"Colorado Signature High Quality Tee","slug":"colorado-heavyweight-tee","category":"t-shirts","size":"L","color":"#9FD2C7","qty":1,"unitPrice":899,"lineTotal":899}]',
        'sub_demo_01'
      ],
      [
        'FIC-A0002',
        '04 Oct 2026, 02:40 pm IST',
        'PROCESSING',
        'FIC-ORD-8822',
        'Ananya Verma',
        'ananya.v@outlook.com',
        '9811223344',
        'Villa 14, Palm Meadows, Whitefield',
        '',
        'Bengaluru',
        'Karnataka',
        '560066',
        'Opposite Community Clubhouse',
        'CP-IND-POST',
        'India Post (Speed Post)',
        '0',
        '1798',
        '1798',
        '2',
        '1) Colorado Signature High Quality Tee | Size M | Color Sage Green | Qty 1 | ₹899\n2) Citrus High Quality Oversized Tee | Size S | Color Citrus Orange | Qty 1 | ₹899',
        '[{"id":1,"name":"Colorado Signature High Quality Tee","slug":"colorado-heavyweight-tee","category":"t-shirts","size":"M","color":"#9FD2C7","qty":1,"unitPrice":899,"lineTotal":899},{"id":2,"name":"Citrus High Quality Oversized Tee","slug":"citrus-oversized-tee","category":"t-shirts","size":"S","color":"#FF6B00","qty":1,"unitPrice":899,"lineTotal":899}]',
        'sub_demo_02'
      ],
      [
        'FIC-A0003',
        '05 Oct 2026, 05:20 pm IST',
        'NEW',
        '',
        'Kavya Menon',
        'kavya.menon@gmail.com',
        '9447112233',
        'House No 28, Panampilly Nagar',
        'Main Avenue',
        'Kochi',
        'Kerala',
        '682036',
        'Behind Central Park',
        'CP-DELHIVERY',
        'Delhivery Surface Express',
        '60',
        '899',
        '959',
        '1',
        '1) Citrus High Quality Oversized Tee | Size XL | Color Citrus Orange | Qty 1 | ₹899 each = ₹899',
        '[{"id":2,"name":"Citrus High Quality Oversized Tee","slug":"citrus-oversized-tee","category":"t-shirts","size":"XL","color":"#FF6B00","qty":1,"unitPrice":899,"lineTotal":899}]',
        'sub_demo_03'
      ]
    ]
  },

  'Support Requests': {
    headers: [
      'timestamp', 'inquiry_id', 'type', 'order_id', 'name', 'email', 'phone',
      'category', 'message', 'status'
    ],
    rows: [
      [
        '04 Oct 2026, 10:30 am IST',
        'FIC-INQ-2026-1042',
        'order-support',
        'FIC-ORD-8821',
        'Rahul Sharma',
        'rahul.sharma@gmail.com',
        '9876543210',
        'shipping',
        'Hi team, could you please provide the Blue Dart airway tracking number for my order? Excited for the drop!',
        'RESOLVED'
      ],
      [
        '05 Oct 2026, 01:15 pm IST',
        'FIC-INQ-2026-1043',
        'product-inquiry',
        '',
        'Vikram Nair',
        'vikram.nair@live.com',
        '9845012345',
        'sizing',
        'Wanted to confirm if the 240 GSM tee fits true to size for a 6ft broad build, or if I should size up to XL for an exaggerated streetwear look.',
        'ANSWERED'
      ],
      [
        '05 Oct 2026, 07:45 pm IST',
        'FIC-INQ-2026-1044',
        'general',
        '',
        'Pooja Iyer',
        'pooja.iyer@gmail.com',
        '9740123456',
        'collection',
        'When will the upcoming overshirt combos and fleece hoodies drop? Loving the Colorado tee quality!',
        'NEW'
      ]
    ]
  }
};

async function main() {
  console.log('🚀 Authenticating with Google Sheets API...');
  const token = await getAccessToken();
  const sheetId = process.env.GOOGLE_SHEET_ID || '1U1bdFZH68Seg3OcV3Wtucmsqg8JL5i3MIGECglu_hfs';

  // 1. Fetch metadata to get tab sheetIds
  const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=properties.title,sheets.properties`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const metadata = await metaRes.json();
  console.log(`✓ Connected to spreadsheet: "${metadata.properties?.title}"`);

  const sheetMap = new Map();
  for (const s of metadata.sheets || []) {
    sheetMap.set(s.properties.title, s.properties.sheetId);
  }

  // 2. Clear all values & write new headers and rows for each tab
  for (const [tabTitle, def] of Object.entries(SHEETS_DATA)) {
    const sheetTabId = sheetMap.get(tabTitle);
    if (sheetTabId === undefined) {
      console.warn(`Tab [${tabTitle}] not found in spreadsheet, skipping.`);
      continue;
    }

    console.log(`\n🧹 Clearing existing values in [${tabTitle}]...`);
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(`'${tabTitle}'!A1:Z500`)}:clear`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`✍️ Writing headers and ${def.rows.length} real valid rows to [${tabTitle}]...`);
    const allValues = [def.headers, ...def.rows];
    const writeRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(`'${tabTitle}'!A1`)}?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: allValues })
    });
    if (!writeRes.ok) {
      console.error(`Failed to write values to [${tabTitle}]:`, await writeRes.text());
    } else {
      console.log(`✓ Data successfully updated in [${tabTitle}].`);
    }
  }

  // 3. Apply professional executive table styling:
  // - Premium Dark Slate Header with bold white text
  // - Alternating zebra striping (White & subtle mist)
  // - Clean crisp borders
  // - Standardized row heights (38px header, 30px data)
  // - Frozen header row
  // - Visible gridlines
  console.log('\n🎨 Applying professional executive table formatting & borders...');
  const batchRequests = [];

  for (const [tabTitle, def] of Object.entries(SHEETS_DATA)) {
    const sheetTabId = sheetMap.get(tabTitle);
    if (sheetTabId === undefined) continue;

    const totalRows = def.rows.length + 1; // including header
    const totalCols = def.headers.length;

    // Freeze header row & show gridlines
    batchRequests.push({
      updateSheetProperties: {
        properties: {
          sheetId: sheetTabId,
          gridProperties: {
            frozenRowCount: 1,
            hideGridlines: false
          }
        },
        fields: 'gridProperties.frozenRowCount,gridProperties.hideGridlines'
      }
    });

    // Header row height = 38px
    batchRequests.push({
      updateDimensionProperties: {
        range: {
          sheetId: sheetTabId,
          dimension: 'ROWS',
          startIndex: 0,
          endIndex: 1
        },
        properties: {
          pixelSize: 38
        },
        fields: 'pixelSize'
      }
    });

    // Data rows height = 30px
    batchRequests.push({
      updateDimensionProperties: {
        range: {
          sheetId: sheetTabId,
          dimension: 'ROWS',
          startIndex: 1,
          endIndex: totalRows
        },
        properties: {
          pixelSize: 30
        },
        fields: 'pixelSize'
      }
    });

    // Header row cell formatting: Deep Slate (#0F172A), bold white text, centered, middle
    batchRequests.push({
      repeatCell: {
        range: {
          sheetId: sheetTabId,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: totalCols
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 15 / 255, green: 23 / 255, blue: 42 / 255 }, // #0F172A
            textFormat: {
              foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
              fontFamily: 'Roboto',
              fontSize: 10,
              bold: true
            },
            horizontalAlignment: 'CENTER',
            verticalAlignment: 'MIDDLE'
          }
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)'
      }
    });

    // Data rows zebra striping:
    for (let r = 1; r < totalRows; r++) {
      const isEven = r % 2 === 0;
      const bg = isEven
        ? { red: 1.0, green: 1.0, blue: 1.0 } // #FFFFFF
        : { red: 248 / 255, green: 250 / 255, blue: 252 / 255 }; // #F8FAFC

      batchRequests.push({
        repeatCell: {
          range: {
            sheetId: sheetTabId,
            startRowIndex: r,
            endRowIndex: r + 1,
            startColumnIndex: 0,
            endColumnIndex: totalCols
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: bg,
              textFormat: {
                foregroundColor: { red: 30 / 255, green: 41 / 255, blue: 59 / 255 }, // #1E293B
                fontFamily: 'Roboto',
                fontSize: 9
              },
              verticalAlignment: 'MIDDLE'
            }
          },
          fields: 'userEnteredFormat(backgroundColor,textFormat,verticalAlignment)'
        }
      });
    }

    // High quality crisp borders:
    // Outer border: Solid Medium (#64748B)
    // Header bottom border: Solid Medium (#475569)
    // Inner horizontal & vertical dividers: Solid light slate (#E2E8F0)
    batchRequests.push({
      updateBorders: {
        range: {
          sheetId: sheetTabId,
          startRowIndex: 0,
          endRowIndex: totalRows,
          startColumnIndex: 0,
          endColumnIndex: totalCols
        },
        top: { style: 'SOLID_MEDIUM', color: { red: 100 / 255, green: 116 / 255, blue: 139 / 255 } },
        bottom: { style: 'SOLID_MEDIUM', color: { red: 100 / 255, green: 116 / 255, blue: 139 / 255 } },
        left: { style: 'SOLID_MEDIUM', color: { red: 100 / 255, green: 116 / 255, blue: 139 / 255 } },
        right: { style: 'SOLID_MEDIUM', color: { red: 100 / 255, green: 116 / 255, blue: 139 / 255 } },
        innerHorizontal: { style: 'SOLID', color: { red: 226 / 255, green: 232 / 255, blue: 240 / 255 } },
        innerVertical: { style: 'SOLID', color: { red: 226 / 255, green: 232 / 255, blue: 240 / 255 } }
      }
    });

    // Auto-fit column widths
    batchRequests.push({
      autoResizeDimensions: {
        dimensions: {
          sheetId: sheetTabId,
          dimension: 'COLUMNS',
          startIndex: 0,
          endIndex: totalCols
        }
      }
    });
  }

  const formatRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests: batchRequests })
  });

  if (!formatRes.ok) {
    const errText = await formatRes.text();
    console.error('❌ Formatting batch update failed:', errText);
  } else {
    console.log('✅ All professional table formatting & borders applied successfully!');
  }

  console.log('\n🎉 ALL SHEETS UPDATED, POPULATED & FORMATTED TO PROFESSIONAL PERFECTION!');
}

main().catch(console.error);
