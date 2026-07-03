import type { FontOptionKey, ThemeSettings } from "../types";

export const FONT_OPTIONS: { key: FontOptionKey; label: string; stack: string }[] = [
  { key: "inter", label: "Inter", stack: '"Inter", system-ui, sans-serif' },
  { key: "roboto", label: "Roboto", stack: '"Roboto", system-ui, sans-serif' },
  { key: "poppins", label: "Poppins", stack: '"Poppins", system-ui, sans-serif' },
  { key: "nunito", label: "Nunito", stack: '"Nunito", system-ui, sans-serif' },
  { key: "montserrat", label: "Montserrat", stack: '"Montserrat", system-ui, sans-serif' },
  { key: "jetbrains-mono", label: "JetBrains Mono", stack: '"JetBrains Mono", ui-monospace, monospace' },
  { key: "merriweather", label: "Merriweather", stack: '"Merriweather", Georgia, serif' },
  { key: "quicksand", label: "Quicksand (arredondada)", stack: '"Quicksand", system-ui, sans-serif' },
];

export function fontStack(key: FontOptionKey): string {
  return FONT_OPTIONS.find((f) => f.key === key)?.stack ?? FONT_OPTIONS[0].stack;
}

export const DARK_THEME: ThemeSettings = {
  mode: "dark",
  fontFamily: "inter",
  fontColor: "#eef1fb",
  mutedColor: "#9aa3c2",
  bgColor: "#101425",
  panelColor: "#1a2036",
  panelAltColor: "#212843",
  borderColor: "#2c3455",
  accentColor: "#6f8cff",
  incomeColor: "#57d98d",
  expenseColor: "#ff7d7d",
  radius: 18,
  toastBg: "#1a2036",
  toastText: "#eef1fb",
  toastSuccess: "#57d98d",
  toastError: "#ff6b6b",
  toastWarning: "#ffb92e",
  toastInfo: "#6f8cff",
};

export const LIGHT_THEME: ThemeSettings = {
  mode: "light",
  fontFamily: "inter",
  fontColor: "#1c2033",
  mutedColor: "#5f6788",
  bgColor: "#f4f5fb",
  panelColor: "#ffffff",
  panelAltColor: "#eef0fa",
  borderColor: "#e2e5f3",
  accentColor: "#5468ff",
  incomeColor: "#1fa971",
  expenseColor: "#e5484d",
  radius: 18,
  toastBg: "#ffffff",
  toastText: "#1c2033",
  toastSuccess: "#1fa971",
  toastError: "#e5484d",
  toastWarning: "#d98c00",
  toastInfo: "#5468ff",
};

export const ACCENT_PRESETS = [
  "#6f8cff", "#57d98d", "#ff7d7d", "#ffb92e", "#c084fc", "#22d3ee", "#f472b6", "#fb923c",
];

export const PANEL_PRESETS_DARK = ["#1a2036", "#171b2e", "#1c2340", "#20263f", "#1b1f2a"];
export const PANEL_PRESETS_LIGHT = ["#ffffff", "#f8f9fe", "#eef0fa", "#fdf7ff", "#f5faf7"];

export function applyTheme(theme: ThemeSettings) {
  const root = document.documentElement;
  root.style.setProperty("--color-bg", theme.bgColor);
  root.style.setProperty("--color-panel", theme.panelColor);
  root.style.setProperty("--color-panel-alt", theme.panelAltColor);
  root.style.setProperty("--color-border", theme.borderColor);
  root.style.setProperty("--color-text", theme.fontColor);
  root.style.setProperty("--color-text-muted", theme.mutedColor);
  root.style.setProperty("--color-accent", theme.accentColor);
  root.style.setProperty("--color-income", theme.incomeColor);
  root.style.setProperty("--color-expense", theme.expenseColor);
  root.style.setProperty("--color-radius", `${theme.radius}px`);
  root.style.setProperty("--font-family", fontStack(theme.fontFamily));
  root.style.setProperty("--toast-bg", theme.toastBg);
  root.style.setProperty("--toast-text", theme.toastText);
  root.style.setProperty("--toast-success", theme.toastSuccess);
  root.style.setProperty("--toast-error", theme.toastError);
  root.style.setProperty("--toast-warning", theme.toastWarning);
  root.style.setProperty("--toast-info", theme.toastInfo);
  root.style.colorScheme = theme.mode;
  root.dataset.themeMode = theme.mode;
}
