import type { Subscription } from './subscription';

const STORAGE_KEY = 'subtracker_subscriptions';

export const storage = {
  saveSubscriptions: (subs: Subscription[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
  },
  loadSubscriptions: (): Subscription[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
};
