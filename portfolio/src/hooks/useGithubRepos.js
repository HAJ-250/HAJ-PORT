import { useEffect, useState } from 'react';
import { site } from '@/data/site.js';

const CACHE_KEY = (username) => `gh-repos-${username}`;
const CACHE_TTL_MS = 10 * 60 * 1000;

/**
 * Fetches the configured user's public repositories from the GitHub API.
 * - hidden: no username configured
 * - loading / success / error states
 * - sessionStorage cache (10 minutes)
 */
export function useGithubRepos() {
  const username = site.github.username;
  const [state, setState] = useState({ status: username ? 'loading' : 'hidden', repos: [] });

  useEffect(() => {
    if (!username) {
      setState({ status: 'hidden', repos: [] });
      return undefined;
    }

    const cacheKey = CACHE_KEY(username);
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const { repos, ts } = JSON.parse(cached);
        if (Array.isArray(repos) && Date.now() - ts < CACHE_TTL_MS) {
          setState({ status: 'success', repos });
          return undefined;
        }
      }
    } catch {
      /* corrupted cache — ignore */
    }

    let cancelled = false;
    setState({ status: 'loading', repos: [] });

    fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`,
      { headers: { Accept: 'application/vnd.github+json' } },
    )
      .then((res) => {
        if (res.status === 403) throw new Error('rate-limited');
        if (!res.ok) throw new Error('fetch-failed');
        return res.json();
      })
      .then((repos) => {
        if (cancelled) return;
        const filtered = repos
          .filter((repo) => !repo.fork)
          .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify({ repos: filtered, ts: Date.now() }));
        } catch {
          /* storage full — ignore */
        }
        setState({ status: 'success', repos: filtered });
      })
      .catch((err) => {
        if (!cancelled) {
          setState({ status: 'error', repos: [], error: err.message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  return state;
}
