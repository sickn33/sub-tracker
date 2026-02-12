
import { describe, it, expect } from 'vitest';
import { generateICSFile } from '../utils/calendar';
import type { Subscription } from '../types/subscription';

describe('calendar utils', () => {
  it('generates valid ICS content for a monthly subscription', () => {
    const sub: Subscription = {
      id: '123',
      name: 'Netflix',
      price: 15.99,
      frequency: 'monthly',
      category: 'Entertainment',
      nextRenewal: '2023-12-01',
    };

    const ics = generateICSFile([sub]);

    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    
    // Check Event
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('SUMMARY:Renew Netflix');
    expect(ics).toContain('RRULE:FREQ=MONTHLY');
    expect(ics).toContain('TRIGGER:-P1D');
    expect(ics).toContain('END:VEVENT');

    // Check Task
    expect(ics).toContain('BEGIN:VTODO');
    expect(ics).toContain('SUMMARY:Pay Netflix');
    expect(ics).toContain('STATUS:NEEDS-ACTION');
    expect(ics).toContain('END:VTODO');

    expect(ics).toContain('END:VCALENDAR');
  });

  it('handles multiple subscriptions', () => {
    const subs: Subscription[] = [
      { id: '1', name: 'A', price: 10, frequency: 'monthly', category: 'Cat', nextRenewal: '2023-01-01' },
      { id: '2', name: 'B', price: 20, frequency: 'yearly', category: 'Cat', nextRenewal: '2024-01-01' }
    ];

    const ics = generateICSFile(subs);
    
    // Should have 2 events and 2 todos
    const events = ics.match(/BEGIN:VEVENT/g);
    const todos = ics.match(/BEGIN:VTODO/g);
    
    expect(events?.length).toBe(2);
    expect(todos?.length).toBe(2);
    expect(ics).toContain('RRULE:FREQ=MONTHLY');
    expect(ics).toContain('RRULE:FREQ=YEARLY');
  });

  it('skips subscriptions without nextRenewal', () => {
    const sub: Subscription = {
      id: '123',
      name: 'OneTime',
      price: 10,
      frequency: 'monthly',
      category: 'Misc'
    };

    const ics = generateICSFile([sub]);
    expect(ics).not.toContain('BEGIN:VEVENT');
  });
});
