"use client";

import { useSyncExternalStore } from "react";

const storageKey = "cleos-docs-theme";
const themeEvent = "cleos-docs-theme-change";

function savedTheme() {
  try {
    const value = localStorage.getItem(storageKey);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function systemTheme() {
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new Event(themeEvent));
}

function subscribe(onChange: () => void) {
  const media = matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    if (!savedTheme()) applyTheme(systemTheme());
  };
  const onStorageChange = (event: StorageEvent) => {
    if (event.key === storageKey) applyTheme(savedTheme() ?? systemTheme());
  };
  window.addEventListener(themeEvent, onChange);
  window.addEventListener("storage", onStorageChange);
  media.addEventListener("change", onSystemChange);
  return () => {
    window.removeEventListener(themeEvent, onChange);
    window.removeEventListener("storage", onStorageChange);
    media.removeEventListener("change", onSystemChange);
  };
}

function currentTheme() {
  return document.documentElement.dataset.theme === "dark";
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, currentTheme, () => false);
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  function toggle() {
    const next = isDark ? "light" : "dark";
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      // The theme still changes for this tab when storage is unavailable.
    }
    applyTheme(next);
  }

  return <button className="theme-toggle" type="button" aria-label={label} title={label} aria-pressed={isDark} onClick={toggle}>
    <svg className="theme-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.5 13.1A8.6 8.6 0 0 1 10.9 3.5 8.6 8.6 0 1 0 20.5 13.1Z" /></svg>
    <svg className="theme-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg>
  </button>;
}
