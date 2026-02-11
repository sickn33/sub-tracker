export type BillingFrequency = 'monthly' | 'yearly' | 'weekly';

export interface Subscription {
  id: string;
  name: string;
  price: number;
  frequency: BillingFrequency;
  category: string;
  nextRenewal: string;
  expirationDate?: string;
}

export const calculateMonthlyTotal = (subscriptions: Subscription[]): number => {
  return subscriptions.reduce((total, sub) => {
    switch (sub.frequency) {
      case 'monthly':
        return total + sub.price;
      case 'yearly':
        return total + sub.price / 12;
      case 'weekly':
        return total + (sub.price * 52) / 12;
      default:
        return total;
    }
  }, 0);
};
