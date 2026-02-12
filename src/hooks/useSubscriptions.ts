import { useState, useEffect, useMemo } from 'react';
import { storage } from '../types/storage';
import { calculateMonthlyTotal, type Subscription } from '../types/subscription';
import { calculateNextBillingDate } from '../utils/billing';

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const loaded = storage.loadSubscriptions();
    const today = new Date();
    return loaded.map(sub => {
      if (sub.nextRenewal) {
        const next = calculateNextBillingDate(today, sub.nextRenewal, sub.frequency, sub.expirationDate);
        if (next !== sub.nextRenewal) {
          return { ...sub, nextRenewal: next };
        }
      }
      return sub;
    });
  });

  useEffect(() => {
    storage.saveSubscriptions(subscriptions);
  }, [subscriptions]);

  const addSubscription = (newSub: Omit<Subscription, 'id'>) => {
    const subWithId: Subscription = {
      ...newSub,
      id: crypto.randomUUID()
    };
    setSubscriptions(prev => [...prev, subWithId]);
  };

  const updateSubscription = (id: string, updatedSub: Omit<Subscription, 'id'>) => {
    setSubscriptions(prev => prev.map(sub => 
      sub.id === id 
        ? { ...updatedSub, id }
        : sub
    ));
  };

  const removeSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  };

  const totalMonthly = useMemo(() => calculateMonthlyTotal(subscriptions), [subscriptions]);

  return {
    subscriptions,
    setSubscriptions,
    addSubscription,
    updateSubscription,
    removeSubscription,
    totalMonthly
  };
}
