import { describe, it, expect } from 'vitest';
import { calculateNextBillingDate } from '../utils/billing';

describe('calculateNextBillingDate', () => {
  it('should return the same date if it is in the future', () => {
    const today = new Date('2024-01-01');
    const futureDate = '2024-02-01';
    expect(calculateNextBillingDate(today, futureDate, 'monthly')).toBe('2024-02-01');
  });

  it('should return the same date if it is today', () => {
    const today = new Date('2024-01-01');
    // Assuming we treat "today" as not yet passed for billing purposes, strictly >
    expect(calculateNextBillingDate(today, '2024-01-01', 'monthly')).toBe('2024-01-01');
  });

  it('should rollover a monthly subscription to the next month', () => {
    const today = new Date('2024-02-02');
    const pastDate = '2024-01-01'; // One month ago
    // Should be 2024-02-01 (passed) -> 2024-03-01 (future of today? No wait.)
    
    // If today is Feb 2nd. 
    // Bill was Jan 1st.
    // Next bill should have been Feb 1st.
    // Feb 1st is ALSO in the past.
    // So it should be Mar 1st.
    
    expect(calculateNextBillingDate(today, pastDate, 'monthly')).toBe('2024-03-01');
  });

  it('should rollover a yearly subscription', () => {
    const today = new Date('2025-01-02');
    const pastDate = '2024-01-01';
    // Next bill: 2025-01-01 (in past relative to today)
    // Rollover: 2026-01-01
    expect(calculateNextBillingDate(today, pastDate, 'yearly')).toBe('2026-01-01');
  });

  it('should rollover a weekly subscription', () => {
      const today = new Date('2024-01-10');
      const pastDate = '2024-01-01';
      // +1 week: Jan 8 (past)
      // +2 weeks: Jan 15 (future)
      expect(calculateNextBillingDate(today, pastDate, 'weekly')).toBe('2024-01-15');
  });

  it('should handle end of month correctly (Jan 31 -> Feb 28/29)', () => {
      const today = new Date('2024-03-01');
      const pastDate = '2024-01-31';
      // +1 month: Feb 29 (2024 is leap)
      // Feb 29 is past.
      // +1 month from Feb 29: Mar 29? Or keep original anchor?
      // Simple implementation: add month. 
      // Jan 31 + 1 month = Feb 29. 
      // Feb 29 + 1 month = Mar 29.
      expect(calculateNextBillingDate(today, pastDate, 'monthly')).toBe('2024-03-31');
  });
});
