import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Define all section namespaces
const sections = [
  'common',
  'nav',
  'dashboard',
  'poems',
  'profile',
  'auth',
  'footer',
  'association',
  'press',
  'about',
  'home'
];

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh'],
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    backend: {
      loadPath: '/locales/{{lng}}/sections/{{ns}}.json',
    },

    react: {
      useSuspense: true,
    },

    // Add all sections as namespaces
    ns: sections,
    defaultNS: 'common',

    // Load all sections for each language
    partialBundledLanguages: true,
    preload: ['en', 'zh'],

    // Ensure all namespaces are loaded when changing languages
    load: 'all',
    
    // Load all namespaces on init
    initImmediate: false,

    // Enable namespace separator
    nsSeparator: ':',
    keySeparator: '.',
  });

// Load all namespaces for the current language
sections.forEach(ns => {
  i18n.loadNamespaces(ns);
});

export default i18n;
