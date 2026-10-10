// Verifies that the GitHub username configured in src/data/site.js resolves.
// Run manually (`npm run verify:github`) or in CI before deploying.
import { site } from '../src/data/site.js';

const USER_AGENT = 'portfolio-github-verify';

async function resolve(username) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: { 'User-Agent': USER_AGENT },
    });
    if (res.status === 200) {
      const data = await res.json();
      return { ok: true, login: data.login, publicRepos: data.public_repos };
    }
    return { ok: false, status: res.status };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

const username = site.github.username;

if (!username) {
  console.log('github.username is null — GitHub links and the repositories section are hidden.');
  process.exit(0);
}

const result = await resolve(username);

if (result.ok) {
  console.log(`✔ ${username} verified on GitHub (${result.publicRepos} public repos).`);
  process.exit(0);
}

console.log(`✖ ${username} did not resolve (${result.status || result.error}).`);
console.log('Trying the likely alternatives…');
for (const alt of ['HAJ-250', 'HAJ250']) {
  if (alt === username) continue;
  const altResult = await resolve(alt);
  console.log(`  ${alt}: ${altResult.ok ? 'VERIFIED' : 'not found'}`);
  if (altResult.ok) {
    console.log(`  → update src/data/site.js to github.username = '${alt}'`);
  }
}
console.log('If none resolve, set github.username = null to hide the GitHub section.');
process.exit(1);
