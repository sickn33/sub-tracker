import { describe, it, expect } from 'vitest';
import { calculateMonthlyTotal } from '../types/subscription';
import type { Subscription } from '../types/subscription';

describe('Subscription Logic', () => {
  it('calculates the correct monthly total for mixed frequencies', () => {
    const subs: Subscription[] = [
      { id: '1', name: 'Netflix', price: 10, frequency: 'monthly', category: 'Streaming', nextRenewal: '2024-03-01' },
      { id: '2', name: 'Amazon Prime', price: 120, frequency: 'yearly', category: 'Streaming', nextRenewal: '2024-03-01' },
    ];

    const total = calculateMonthlyTotal(subs);
    expect(total).toBe(20); // 10 + 120/12
  });

  it('handles weekly subscriptions correctly', () => {
    const subs: Subscription[] = [
      { id: '1', name: 'Weekly Sub', price: 10, frequency: 'weekly', category: 'Service', nextRenewal: '2024-03-01' },
    ];

    const total = calculateMonthlyTotal(subs);
    expect(total).toBeCloseTo((10 * 52) / 12, 2);
  });
});
