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

export const calculateNextBillingDate = (
  currentDate: Date,
  subscriptionDate: string,
  frequency: BillingFrequency
): string => {
  if (!subscriptionDate) return '';

  const [sYear, sMonth, sDay] = subscriptionDate.split('-').map(Number);
  let date = new Date(sYear, sMonth - 1, sDay);
  
  const today = new Date(currentDate);
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  // If the date is today or in the future, return formatted input
  if (date >= today) {
    return toLocalISOString(date);
  }

  // Otherwise, roll over until we reach a date that is >= today
  const anchorDay = sDay;
  let periods = 1;

  while (date < today) {
    if (frequency === 'weekly') {
      date = new Date(sYear, sMonth - 1, sDay + (7 * periods));
    } else if (frequency === 'monthly') {
      // Create new date for the target month
      date = new Date(sYear, sMonth - 1 + periods, anchorDay);
      // Handle day clipping (e.g. Jan 31 -> Feb 29)
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
    periods++;
  }

  return toLocalISOString(date);
};
