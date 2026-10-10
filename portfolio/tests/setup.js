import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

// Node 22+ defines a broken experimental `localStorage` global (undefined
// unless --localstorage-file is passed). In the Vitest jsdom environment it
// shadows the jsdom-backed storage, so we install an in-memory Storage
// implementation on both `window` and `globalThis` before anything runs.
function createMemoryStorage() {
  const store = new Map();
  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key) {
      return store.has(String(key)) ? store.get(String(key)) : null;
    },
    key(index) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key) {
      store.delete(String(key));
    },
    setItem(key, value) {
      store.set(String(key), String(value));
    },
  };
}

for (const name of ['localStorage', 'sessionStorage']) {
  if (typeof window === 'undefined') break;
  const missing = typeof window[name] === 'undefined' || window[name] === null;
  if (missing) {
    const storage = createMemoryStorage();
    try {
      Object.defineProperty(window, name, {
        value: storage,
        configurable: true,
        writable: true,
      });
    } catch {
      /* ignore */
    }
  }
  try {
    Object.defineProperty(globalThis, name, {
      value: window[name],
      configurable: true,
      writable: true,
    });
  } catch {
      /* ignore */
  }
}

beforeAll(() => {
  if (typeof window === 'undefined') return;
  // jsdom lacks IntersectionObserver: report targets as immediately visible
  // so reveal-on-scroll components render their final state in tests.
  class IntersectionObserverStub {
    constructor(callback) {
      this.callback = callback;
    }
    observe(target) {
      this.callback(
        [{ target, isIntersecting: true, intersectionRatio: 1 }],
        this,
      );
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  window.IntersectionObserver = IntersectionObserverStub;

  if (!window.matchMedia) {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  }
});
