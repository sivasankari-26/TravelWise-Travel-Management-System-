import { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext(null);
const SETTINGS_KEY = 'tw_settings';

const DEFAULT_SETTINGS = {
  theme: 'light',
  fontSize: 'medium',
  language: 'en',
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.setAttribute('data-font-size', settings.fontSize);
    document.documentElement.setAttribute('lang', settings.language);
  }, [settings]);

  const setTheme = (theme) => setSettings((s) => ({ ...s, theme }));
  const setFontSize = (fontSize) => setSettings((s) => ({ ...s, fontSize }));
  const setLanguage = (language) => setSettings((s) => ({ ...s, language }));

  return (
    <SettingsContext.Provider value={{ ...settings, setTheme, setFontSize, setLanguage }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}