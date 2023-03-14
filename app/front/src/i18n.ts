import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import uaTranslation from './translation/ua-translation.json';
import enTranslation from './translation/en-translation.json';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  ua: {
    translation: uaTranslation
  },
  en: {
    translation: enTranslation
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ua",
    interpolation: {
      escapeValue: false
    }
  });

  export default i18n;