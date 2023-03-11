import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { resources } from './resources';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: Localization.locale.split('-')[0],
  fallbackLng: 'en',
  debug: false,
  resources,

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
