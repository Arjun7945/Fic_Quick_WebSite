import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Load .env.local if present
const envLocalPath = path.resolve('.env.local');
if (fs.existsSync(envLocalPath)) {
  const lines = fs.readFileSync(envLocalPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const sheetId = process.env.GOOGLE_SHEET_ID || '1U1bdFZH68Seg3OcV3Wtucmsqg8JL5i3MIGECglu_hfs';
const keyFileCandidate = [
  process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
  path.resolve('../credentials/ficcado-quick-website-5fc91a2f02ba.json'),
  path.resolve('credentials/ficcado-quick-website-5fc91a2f02ba.json'),
].find((p) => p && fs.existsSync(p));

if (!keyFileCandidate) {
  console.error('Credentials file not found');
  process.exit(1);
}

const key = JSON.parse(fs.readFileSync(keyFileCandidate, 'utf8'));
const now = Math.floor(Date.now() / 1000);
const claim = {
  iss: key.client_email,
  scope: 'https://www.googleapis.com/auth/spreadsheets',
  aud: 'https://oauth2.googleapis.com/token',
  exp: now + 3600,
  iat: now,
};

const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64(claim)}`;
const signer = crypto.createSign('RSA-SHA256');
signer.update(unsigned);
signer.end();
const assertion = `${unsigned}.${signer.sign(key.private_key, 'base64url')}`;

const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  }),
});

const token = (await tokenRes.json()).access_token;
if (!token) {
  console.error('Failed to get Google token');
  process.exit(1);
}

// 1. Clear old data from A2:Z100 in Item Management
const clearRange = encodeURIComponent("'Item Management'!A2:Z100");
const clearRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${clearRange}:clear`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
});

console.log('Cleared old items in Item Management:', clearRes.status);

// 2. Put real products into Item Management A2:N14 (13 items total)
// Headers: ['id', 'item_name', 'type', 'price', 'sizes', 'average_rating', 'review_count', 'colors', 'description', 'slug', 'in_stock', 'featured', 'active', 'sort_order']
const realRows = [
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
];

const updateRange = encodeURIComponent(`'Item Management'!A2:N${realRows.length + 1}`);
const updateRes = await fetch(
  `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${updateRange}?valueInputOption=USER_ENTERED`,
  {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      range: `'Item Management'!A2:N${realRows.length + 1}`,
      majorDimension: 'ROWS',
      values: realRows,
    }),
  }
);

const updateData = await updateRes.json();
console.log('Updated real products into Google Sheets:', updateData);
