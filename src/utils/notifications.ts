
import type { Subscription } from "../types/subscription";

export const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return;
    }

    if (Notification.permission === "granted") {
        return;
    }

    if (Notification.permission !== "denied") {
        await Notification.requestPermission();
    }
};

export const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!("Notification" in window)) return;
    
    if (Notification.permission === "granted") {
        new Notification(title, options);
    }
};

export const checkUpcomingRenewals = (subscriptions: Subscription[]) => {
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    subscriptions.forEach(sub => {
        if (!sub.nextRenewal) return;

        const renewalDate = new Date(sub.nextRenewal);
        
        // Check if renewal is within the next 3 days and hasn't passed yet
        if (renewalDate > today && renewalDate <= threeDaysFromNow) {
            const daysUntil = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            
            // Generate a unique key for this notification instance (e.g., specific renewal date)
            // prevents spamming the user every time they refresh the page
            const notificationKey = `notified-${sub.id}-${sub.nextRenewal}`;
            const hasNotified = localStorage.getItem(notificationKey);

            if (!hasNotified) {
                const title = `Subscription Renewal Alert: ${sub.name}`;
                const body = `${sub.name} is renewing in ${daysUntil} day${daysUntil > 1 ? 's' : ''} for €${sub.price}`;
                
                sendNotification(title, {
                    body,
                    icon: '/vite.svg' // Placeholder icon
                });

                // Mark as notified for this specific renewal instance
                localStorage.setItem(notificationKey, 'true');
            }
        }
    });
};
