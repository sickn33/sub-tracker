import type { BillingFrequency } from '../types/subscription';

/**
 * Calculates the next billing date for a subscription.
 * If the provided date is in the past, it rolls over until it's in the future.
 * 
 * @param currentDate The current date (system date)
 * @param subscriptionDate The stored billing date in YYYY-MM-DD format
 * @param frequency The billing frequency
 * @returns The next billing date in YYYY-MM-DD format
 */
/**
 * Formats a Date object to YYYY-MM-DD string in local time.
 */
const toLocalISOString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const calculateCostPerMonth = (price: number, frequency: BillingFrequency): number => {
    if (!price || price < 0) return 0;
    switch (frequency) {
        case 'monthly': return price;
        case 'yearly': return price / 12;
        case 'weekly': return (price * 52) / 12;
        default: return price;
    }
};

export const calculateNextBillingDate = (
  currentDate: Date,
  subscriptionDate: string,
  frequency: BillingFrequency,
  expirationDate?: string
): string => {
  if (!subscriptionDate) return '';

  const parts = subscriptionDate.split('-');
  if (parts.length !== 3) return '';
  
  const [sYear, sMonth, sDay] = parts.map(Number);
  if (isNaN(sYear) || isNaN(sMonth) || isNaN(sDay)) return '';

  let date = new Date(sYear, sMonth - 1, sDay);
  if (isNaN(date.getTime())) return '';
  
  const today = new Date(currentDate);
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  // Helper to check expiration
  const isExpired = (targetDate: Date): boolean => {
    if (!expirationDate) return false;
    const [eYear, eMonth, eDay] = expirationDate.split('-').map(Number);
    const exp = new Date(eYear, eMonth - 1, eDay);
    exp.setHours(0, 0, 0, 0);
    return targetDate > exp;
  };

  // If the date is today or in the future, return it (unless expired)
  if (date >= today) {
    return isExpired(date) ? '' : toLocalISOString(date);
  }

  // Otherwise, roll over until we reach a date that is >= today
  const anchorDay = sDay;
  let periods = 1;

  while (date < today) {
    if (frequency === 'weekly') {
      date = new Date(sYear, sMonth - 1, sDay + (7 * periods));
    } else if (frequency === 'monthly') {
      date = new Date(sYear, sMonth - 1 + periods, anchorDay);
      if (date.getDate() !== anchorDay) {
         date.setDate(0); 
      }
    } else if (frequency === 'yearly') {
      date = new Date(sYear + periods, sMonth - 1, anchorDay);
      if (date.getDate() !== anchorDay) {
         date.setDate(0);
      }
    }
    date.setHours(0, 0, 0, 0);

    // If we've rolled over and it's already expired, stop and return empty
    if (isExpired(date)) return '';

    periods++;
  }

  return toLocalISOString(date);
};
