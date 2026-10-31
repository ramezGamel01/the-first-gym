import { createContext, useContext, useEffect } from "react";

export const I18nContext = createContext(null);

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

// Sets the tab title for a page: "Classes and timetable | The First Gym"
export function usePageTitle(key) {
  const { t } = useI18n();
  const title = t(key);
  useEffect(() => {
    document.title = key === "home.title" ? `The First Gym | ${title}` : `${title} | The First Gym`;
  }, [key, title]);
}
