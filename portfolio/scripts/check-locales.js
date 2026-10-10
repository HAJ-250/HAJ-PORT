// Dev/CI check: fails if any key exists in en but is missing in fr or rw
// (or if a locale file is missing entirely).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const localesDir = fileURLToPath(new URL('../src/i18n/locales', import.meta.url));
const LOCALES = ['en', 'fr', 'rw'];

function flatten(obj, prefix = '') {
  let keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys = keys.concat(flatten(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const namespaces = fs
  .readdirSync(path.join(localesDir, 'en'))
  .filter((file) => file.endsWith('.json'));

let failed = false;

for (const ns of namespaces) {
  const enKeys = new Set(flatten(JSON.parse(fs.readFileSync(path.join(localesDir, 'en', ns), 'utf8'))));
  for (const locale of LOCALES.slice(1)) {
    const file = path.join(localesDir, locale, ns);
    if (!fs.existsSync(file)) {
      console.error(`MISSING FILE: ${locale}/${ns}`);
      failed = true;
      continue;
    }
    const otherKeys = new Set(flatten(JSON.parse(fs.readFileSync(file, 'utf8'))));
    const missing = [...enKeys].filter((key) => !otherKeys.has(key));
    const extra = [...otherKeys].filter((key) => !enKeys.has(key));
    if (missing.length > 0) {
      console.error(`[${locale}/${ns}] missing ${missing.length} key(s):\n  ${missing.join('\n  ')}`);
      failed = true;
    }
    if (extra.length > 0) {
      console.warn(`[${locale}/${ns}] extra keys not in en: ${extra.join(', ')}`);
    }
  }
}

if (failed) {
  console.error('\nLocale parity check FAILED.');
  process.exit(1);
}
console.log(`Locale parity OK — ${LOCALES.join(', ')} have identical key sets across ${namespaces.length} namespaces.`);
