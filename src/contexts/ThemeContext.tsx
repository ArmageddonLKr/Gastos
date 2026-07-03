import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ThemeSettings } from "../types";
import { getSettings, saveSettings } from "../db/db";
import { applyTheme, DARK_THEME, LIGHT_THEME } from "../utils/theme";

interface ThemeContextValue {
  theme: ThemeSettings;
  loading: boolean;
  updateTheme: (patch: Partial<ThemeSettings>) => void;
  resetTheme: (mode: "dark" | "light") => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const LS_KEY = "gastos:theme";

function readCachedTheme(): ThemeSettings {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as ThemeSettings;
  } catch {
    // ignore malformed cache
  }
  return DARK_THEME;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(readCachedTheme);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    let active = true;
    getSettings().then((settings) => {
      if (!active) return;
      setTheme(settings.theme);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const persist = async (next: ThemeSettings) => {
    setTheme(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    const settings = await getSettings();
    await saveSettings({ ...settings, theme: next });
  };

  const updateTheme = (patch: Partial<ThemeSettings>) => {
    persist({ ...theme, ...patch });
  };

  const resetTheme = (mode: "dark" | "light") => {
    persist(mode === "dark" ? DARK_THEME : LIGHT_THEME);
  };

  return (
    <ThemeContext.Provider value={{ theme, loading, updateTheme, resetTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
