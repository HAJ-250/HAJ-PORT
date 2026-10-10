import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const localesDir = path.resolve(process.cwd(), 'src/i18n/locales');
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

describe('locale parity', () => {
  const namespaces = fs
    .readdirSync(path.join(localesDir, 'en'))
    .filter((file) => file.endsWith('.json'));

  for (const ns of namespaces) {
    it(`${ns}: fr and rw contain every en key`, () => {
      const enKeys = new Set(
        flatten(JSON.parse(fs.readFileSync(path.join(localesDir, 'en', ns), 'utf8'))),
      );
      for (const locale of LOCALES.slice(1)) {
        const file = path.join(localesDir, locale, ns);
        expect(fs.existsSync(file)).toBe(true);
        const localeKeys = new Set(
          flatten(JSON.parse(fs.readFileSync(file, 'utf8'))),
        );
        const missing = [...enKeys].filter((key) => !localeKeys.has(key));
        expect(missing, `[${locale}/${ns}] missing: ${missing.join(', ')}`).toEqual([]);
      }
    });
  }
});
