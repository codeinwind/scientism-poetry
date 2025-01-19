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
  'home',
  'admin',
  'authors'
];

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh'],
    debug: false, // Set debug to false to suppress logging
    
    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    // Configure backend to load translations from sections folder
    backend: {
      loadPath: '/locales/{{lng}}/sections/{{ns}}.json',
    },

    react: {
      useSuspense: true,
    },

    // Configure namespaces
    ns: sections,
    defaultNS: 'common',

    // Load all sections for each language
    partialBundledLanguages: true,
    preload: ['en', 'zh'],
    load: 'all',
    
    // Ensure translations are loaded immediately
    initImmediate: false,

    // Configure separators for translation keys
    nsSeparator: ':',
    keySeparator: '.',
  });

// Ensure all namespaces are loaded
sections.forEach(ns => {
  i18n.loadNamespaces(ns);
});

export default i18n;
