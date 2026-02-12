import type { Subscription } from '../types/subscription';

export const generateICSFile = (subscriptions: Subscription[]): string => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SubTracker//App//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  subscriptions.forEach(sub => {
    if (!sub.nextRenewal) return;

    // Parse next renewal date
    const startDate = new Date(sub.nextRenewal);
    const startStr = startDate.toISOString().replace(/[-:]/g, '').split('.')[0].slice(0, 8); // YYYYMMDD for all-day events

    // Determine recurrence rule
    let rruleFrequency = '';
    switch (sub.frequency) {
      case 'monthly':
        rruleFrequency = 'FREQ=MONTHLY';
        break;
      case 'yearly':
        rruleFrequency = 'FREQ=YEARLY';
        break;
      case 'weekly':
        rruleFrequency = 'FREQ=WEEKLY';
        break;
    }

    const description = `Price: ${sub.price} | Category: ${sub.category}`;
    const uid = sub.id;

    // 1. Create VEVENT (Calendar Event)
    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${uid}-event`,
      `DTSTAMP:${timestamp}`,
      `DTSTART;VALUE=DATE:${startStr}`,
      `SUMMARY:Renew ${sub.name}`,
      `DESCRIPTION:${description}`,
      rruleFrequency ? `RRULE:${rruleFrequency}` : '',
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      'DESCRIPTION:Subscription Renewal Reminder',
      'TRIGGER:-P1D', // 1 day before
      'END:VALARM',
      'END:VEVENT'
    );

    // 2. Create VTODO (Task)
    // Note: VTODO support varies by client. 
    icsContent.push(
      'BEGIN:VTODO',
      `UID:${uid}-task`,
      `DTSTAMP:${timestamp}`,
      `DUE;VALUE=DATE:${startStr}`, 
      `SUMMARY:Pay ${sub.name}`,
      `DESCRIPTION:${description}`,
      rruleFrequency ? `RRULE:${rruleFrequency}` : '',
      'STATUS:NEEDS-ACTION',
      'END:VTODO'
    );
  });

  icsContent.push('END:VCALENDAR');

  return icsContent.filter(line => line).join('\r\n'); // Filter empty lines (like empty RRULE)
};

export const downloadICS = (subscriptions: Subscription[]) => {
  const content = generateICSFile(subscriptions);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'subscriptions.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
