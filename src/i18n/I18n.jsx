import { useCallback, useEffect, useMemo, useState } from "react";
import { I18nContext } from "./context.js";
import { makeFormat, makeTranslator, pickFrom } from "./translate.js";
import { store } from "../lib/storage.js";

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => (document.documentElement.lang === "ar" ? "ar" : "en"));

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((next) => {
    store.set("firstgym:lang", next);
    setLangState(next);
  }, []);

  const value = useMemo(
    () => ({
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      setLang,
      t: makeTranslator(lang),
      f: makeFormat(lang),
      pick: pickFrom(lang),
    }),
    [lang, setLang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
