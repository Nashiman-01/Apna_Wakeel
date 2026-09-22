import { createContext, useContext, useEffect, useState } from "react";
import en from "./en.js";
import ur from "./ur.js";

// -----------------------------------------------------------------------------
// LANGUAGES
// To add Khowar later:
//   1. Copy en.js to khw.js and translate the text on the right side.
//   2. Add:  import khw from "./khw.js";
//   3. Add one line below:  khw: { code: "khw", name: "کھوار", dir: "rtl", strings: khw },
// Any text you have not translated yet falls back to English automatically.
// -----------------------------------------------------------------------------
export const languages = {
  en: { code: "en", name: "English", dir: "ltr", strings: en },
  ur: { code: "ur", name: "اردو", dir: "rtl", strings: ur },
};

const LanguageContext = createContext(null);

function getSavedLanguage() {
  try {
    const saved = localStorage.getItem("language");
    if (saved && languages[saved]) return saved;
  } catch (error) {
    // storage not available, that is fine
  }
  return "en";
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getSavedLanguage);

  // Tell the browser the language and reading direction (left-to-right or right-to-left).
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = languages[language].dir;
  }, [language]);

  function setLanguage(code) {
    setLanguageState(code);
    try {
      localStorage.setItem("language", code);
    } catch (error) {
      // ignore
    }
  }

  // t("some.key") gives the text in the current language.
  // t("some.key", { name: "Ali" }) also replaces {name} in the text.
  function t(key, values = {}) {
    let text = languages[language].strings[key] ?? en[key] ?? key;
    for (const name in values) {
      text = text.split(`{${name}}`).join(values[name]);
    }
    return text;
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
