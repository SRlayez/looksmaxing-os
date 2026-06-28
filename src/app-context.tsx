import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { loadSettings, saveSettings } from './storage/settings';
import type { AppSettings } from './types';

interface AppContextValue {
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings> | ((current: AppSettings) => AppSettings)) => void;
  resetSettings: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const dark = settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      root.dataset.theme = dark ? 'dark' : 'light';
      root.classList.toggle('reduced-motion', settings.reducedMotion);
    };
    apply();
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener?.('change', apply);
    return () => media.removeEventListener?.('change', apply);
  }, [settings.theme, settings.reducedMotion]);

  const value = useMemo<AppContextValue>(() => ({
    settings,
    updateSettings: (patch) => {
      setSettings((current) => typeof patch === 'function' ? patch(current) : { ...current, ...patch });
    },
    resetSettings: () => setSettings(loadSettings()),
  }), [settings]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}
