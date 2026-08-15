import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import viTranslation from './locales/vi/translation.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  vi: {
    translation: viTranslation,
  },
};

const defaultLng = 'en';

const getInitialLanguage = () => {
  try {
    const saved = localStorage.getItem('i18nextLng');
    return saved && ['en', 'vi'].includes(saved) ? saved : defaultLng;
  } catch {
    return defaultLng;
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ['en', 'vi'],
    fallbackLng: defaultLng,
    lng: getInitialLanguage(),
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem('i18nextLng', lng);
  } catch {
    // ignore storage issues in restricted environments
  }
});

export default i18n;
