// File-based blog data layer: Markdown files in src/content/blog/*.md with
// frontmatter (title, date, summary, tags, draft). Loaded synchronously via
// import.meta.glob. Pure functions only — no React imports here, so the module
// is safe to import from anywhere (including tests and non-React contexts).
const rawModules = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

let cache = null;

/** Minimal frontmatter parser for simple `key: value` YAML (including [flow, arrays]). */
export function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    const [, key, rawValue] = m;
    let value = rawValue.trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
    } else if (value === 'true' || value === 'false') {
      value = value === 'true';
    } else if (/^-?\d+$/.test(value)) {
      value = Number(value);
    }
    data[key] = value;
  }
  return { data, content: match[2] };
}

function loadPosts() {
  if (cache) return cache;
  cache = Object.entries(rawModules)
    .map(([filePath, raw]) => {
      const { data, content } = parseFrontmatter(raw);
      return {
        slug: filePath.split('/').pop().replace(/\.md$/, ''),
        ...data,
        content,
      };
    })
    .filter((post) => post.title && post.date)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return cache;
}

export function getPosts() {
  return loadPosts();
}

/** Only non-draft posts are ever rendered publicly. */
export function getPublishedPosts() {
  return loadPosts().filter((post) => !post.draft);
}

export function getPostBySlug(slug) {
  return loadPosts().find((post) => post.slug === slug && !post.draft);
}
