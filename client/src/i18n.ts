import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  es: {
    translation: esTranslation,
  },
};

// Clear any previous language setting to force English default
if (!localStorage.getItem('i18nextLng') || !['en', 'es'].includes(localStorage.getItem('i18nextLng') || '')) {
  localStorage.setItem('i18nextLng', 'en');
}

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    lng: 'en', // Force English as default
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // Namespace and key separator
    keySeparator: '.',
    nsSeparator: ':',
  });

export default i18n;