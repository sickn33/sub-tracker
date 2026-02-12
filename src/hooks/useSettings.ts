import { useState, useEffect } from 'react';

export type Currency = '€' | '$' | '£' | '¥' | 'CHF';

export interface AppSettings {
  currency: Currency;
  isBackupConnected: boolean; // Just for UI state, actual handle is in IndexedDB (managed by useLocalBackup)
}

const DEFAULT_SETTINGS: AppSettings = {
  currency: '€',
  isBackupConnected: false,
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const stored = localStorage.getItem('sub-tracker-settings');
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('sub-tracker-settings', JSON.stringify(settings));
  }, [settings]);

  const updateCurrency = (currency: Currency) => {
    setSettings(prev => ({ ...prev, currency }));
  };
  
  const setBackupConnected = (isConnected: boolean) => {
     setSettings(prev => ({ ...prev, isBackupConnected: isConnected }));
  };

  return {
    settings,
    updateCurrency,
    setBackupConnected
  };
}
