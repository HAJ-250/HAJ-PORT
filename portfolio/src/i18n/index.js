import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enProjects from './locales/en/projects.json';
import enContact from './locales/en/contact.json';
import enBlog from './locales/en/blog.json';

import frCommon from './locales/fr/common.json';
import frHome from './locales/fr/home.json';
import frProjects from './locales/fr/projects.json';
import frContact from './locales/fr/contact.json';
import frBlog from './locales/fr/blog.json';

import rwCommon from './locales/rw/common.json';
import rwHome from './locales/rw/home.json';
import rwProjects from './locales/rw/projects.json';
import rwContact from './locales/rw/contact.json';
import rwBlog from './locales/rw/blog.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', short: 'EN' },
  { code: 'fr', short: 'FR' },
  { code: 'rw', short: 'RW' },
];

export const i18n = i18next.createInstance();

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources: {
    en: { common: enCommon, home: enHome, projects: enProjects, contact: enContact, blog: enBlog },
    fr: { common: frCommon, home: frHome, projects: frProjects, contact: frContact, blog: frBlog },
    rw: { common: rwCommon, home: rwHome, projects: rwProjects, contact: rwContact, blog: rwBlog },
  },
  fallbackLng: 'en',
  supportedLngs: ['en', 'fr', 'rw'],
  nonExplicitSupportedLngs: true,
  ns: ['common', 'home', 'projects', 'contact', 'blog'],
  defaultNS: 'common',
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage'],
    lookupLocalStorage: 'i18nextLng',
  },
  interpolation: { escapeValue: false },
});

// Keep <html lang> in sync with the active language
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
});

export default i18n;
