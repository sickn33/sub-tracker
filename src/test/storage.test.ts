import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Subscription } from '../types/subscription';
import { storage } from '../types/storage';

describe('Storage Service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('saves and loads subscriptions from localStorage', () => {
    const subs: Subscription[] = [
      { id: '1', name: 'Netflix', price: 10, frequency: 'monthly', category: 'Streaming', nextRenewal: '2024-03-01' }
    ];

    storage.saveSubscriptions(subs);
    const loaded = storage.loadSubscriptions();

    expect(loaded).toEqual(subs);
    expect(localStorage.getItem('subtracker_subscriptions')).toContain('Netflix');
  });

  it('returns empty array if nothing is stored', () => {
    const loaded = storage.loadSubscriptions();
    expect(loaded).toEqual([]);
  });
});
