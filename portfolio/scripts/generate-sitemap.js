// Generates public/sitemap.xml from the static routes, project pages and
// published (non-draft) blog posts. Uses VITE_SITE_URL when set.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const siteUrl = (process.env.VITE_SITE_URL || 'https://your-project.vercel.app').replace(/\/$/, '');

const blogDir = path.join(root, 'src/content/blog');
const blogRoutes = [];
if (fs.existsSync(blogDir)) {
  for (const file of fs.readdirSync(blogDir)) {
    if (!file.endsWith('.md')) continue;
    const raw = fs.readFileSync(path.join(blogDir, file), 'utf8');
    const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const draft = fm ? /draft:\s*true/.test(fm[1]) : false;
    if (!draft) blogRoutes.push(`/blog/${file.replace(/\.md$/, '')}`);
  }
}

const { projects } = await import(pathToFileURL(path.join(root, 'src/data/projects.js')).href);
const projectRoutes = projects.map((project) => `/projects/${project.slug}`);

const routes = ['/', '/blog', ...projectRoutes, ...blogRoutes];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${siteUrl}${route}</loc>
    <changefreq>monthly</changefreq>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(root, 'public/sitemap.xml'), xml);
console.log(`sitemap.xml written — ${routes.length} URLs → ${siteUrl}`);
