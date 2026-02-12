
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSettings } from '../hooks/useSettings';

describe('useSettings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default settings', () => {
    const { result } = renderHook(() => useSettings());
    expect(result.current.settings.currency).toBe('€');
    expect(result.current.settings.isBackupConnected).toBe(false);
  });

  it('should update currency', () => {
    const { result } = renderHook(() => useSettings());
    act(() => {
      result.current.updateCurrency('$');
    });
    expect(result.current.settings.currency).toBe('$');
  });

  it('should persist settings to localStorage', () => {
    const { result } = renderHook(() => useSettings());
    act(() => {
      result.current.updateCurrency('£');
    });
    
    // Check local storage
    const stored = JSON.parse(localStorage.getItem('sub-tracker-settings') || '{}');
    expect(stored.currency).toBe('£');
  });

  it('should load settings from localStorage on init', () => {
    localStorage.setItem('sub-tracker-settings', JSON.stringify({ currency: 'CHF', isBackupConnected: false }));
    const { result } = renderHook(() => useSettings());
    expect(result.current.settings.currency).toBe('CHF');
  });
});
