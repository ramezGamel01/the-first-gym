// Theme and animation settings. index.html applies the saved values before the first paint;
// this keeps them in sync afterwards.
import { useCallback, useEffect, useMemo, useState } from "react";
import { PrefsContext } from "./prefs-context.js";
import { store } from "../lib/storage.js";

const THEME_COLOR = { dark: "#000000", light: "#e6e5e0" };

export function PrefsProvider({ children }) {
  const root = document.documentElement;
  const [theme, setTheme] = useState(() => (root.dataset.theme === "light" ? "light" : "dark"));
  // Off when the visitor turned animations off here, or asks the OS for reduced motion and hasn't chosen here
  const [motion, setMotion] = useState(() => !root.classList.contains("no-motion"));

  useEffect(() => {
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
  }, [root, theme]);

  useEffect(() => {
    root.classList.toggle("no-motion", !motion);
  }, [root, motion]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      store.set("firstgym:theme", next);
      return next;
    });
  }, []);

  const toggleMotion = useCallback(() => {
    setMotion((current) => {
      store.set("firstgym:motion", current ? "off" : "on");
      return !current;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme, motion, toggleMotion }), [theme, toggleTheme, motion, toggleMotion]);
  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}
