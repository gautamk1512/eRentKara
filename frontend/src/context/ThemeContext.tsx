"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
const ThemeContext = createContext({ dark: false, toggle: () => {} });
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
    const sync = (event: StorageEvent) => { if (event.key === "erk_theme") { const value = event.newValue === "dark"; setDark(value); document.documentElement.dataset.theme = value ? "dark" : "light"; } };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const toggle = () => {
    const next = !dark; setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try { localStorage.setItem("erk_theme", next ? "dark" : "light"); } catch {}
  };
  return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>;
}
export function ThemeToggle() {
  const { dark, toggle } = useContext(ThemeContext);
  return <button type="button" className="premium-theme-toggle" onClick={toggle} aria-label={dark ? "Switch to normal theme" : "Switch to black theme"} title={dark ? "Normal theme" : "Black theme"} aria-pressed={dark}>{dark ? <Sun size={17}/> : <Moon size={17}/>}</button>;
}
