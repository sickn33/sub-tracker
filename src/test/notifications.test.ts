
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkUpcomingRenewals, requestNotificationPermission } from '../utils/notifications';
import type { Subscription } from '../types/subscription';

describe('notifications utils', () => {
  const mockNotification = {
    requestPermission: vi.fn(),
    permission: 'default',
  } as unknown as typeof Notification;

  beforeEach(() => {
    vi.stubGlobal('Notification', mockNotification);
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('requestNotificationPermission', () => {
    it('requests permission if not denied or granted', async () => {
      // @ts-expect-error Mocking readonly property
      Notification.permission = 'default';
      await requestNotificationPermission();
      expect(Notification.requestPermission).toHaveBeenCalled();
    });

    it('does not request permission if already granted', async () => {
      // @ts-expect-error Mocking readonly property
      Notification.permission = 'granted';
      await requestNotificationPermission();
      expect(Notification.requestPermission).not.toHaveBeenCalled();
    });
  });

  describe('checkUpcomingRenewals', () => {
    it('sends notification for renewal in 3 days', () => {
      const today = new Date();
      const nextRenewal = new Date();
      nextRenewal.setDate(today.getDate() + 2); // 2 days from now

      const sub: Subscription = {
        id: '1',
        name: 'Test Sub',
        price: 10,
        frequency: 'monthly',
        category: 'Test',
        nextRenewal: nextRenewal.toISOString()
      };

      // Mock Notification constructor
      const notificationConstructor = vi.fn();
      vi.stubGlobal('Notification', notificationConstructor);
      // @ts-expect-error Mocking readonly property
      Notification.permission = 'granted';

      checkUpcomingRenewals([sub]);

      expect(notificationConstructor).toHaveBeenCalledWith(
        expect.stringContaining('Subscription Renewal Alert: Test Sub'),
        expect.objectContaining({ body: expect.stringContaining('renewing in 2 days') })
      );
    });

    it('does not spam notifications', () => {
      const today = new Date();
      const nextRenewal = new Date();
      nextRenewal.setDate(today.getDate() + 2);

      const sub: Subscription = {
        id: '1',
        name: 'Test Sub',
        price: 10,
        frequency: 'monthly',
        category: 'Test',
        nextRenewal: nextRenewal.toISOString()
      };

      const notificationConstructor = vi.fn();
      vi.stubGlobal('Notification', notificationConstructor);
      // @ts-expect-error Mocking readonly property
      Notification.permission = 'granted';

      // First call
      checkUpcomingRenewals([sub]);
      expect(notificationConstructor).toHaveBeenCalledTimes(1);

      // Second call (should be ignored)
      checkUpcomingRenewals([sub]);
      expect(notificationConstructor).toHaveBeenCalledTimes(1);
    });
  });
});
