export type BillingFrequency = 'monthly' | 'yearly' | 'weekly';

export interface Subscription {
  id: string;
  name: string;
  price: number;
  frequency: BillingFrequency;
  category: string;
  nextRenewal?: string;
  expirationDate?: string;
}

export const calculateMonthlyTotal = (subscriptions: Subscription[]): number => {
  return subscriptions.reduce((total, sub) => {
    const price = typeof sub.price === 'number' && !isNaN(sub.price) ? sub.price : 0;
    if (price < 0) return total; // Ignore negative prices

    switch (sub.frequency) {
      case 'monthly':
        return total + price;
      case 'yearly':
        return total + price / 12;
      case 'weekly':
        return total + (price * 52) / 12;
      default:
        return total;
    }
  }, 0);
};
