export async function trackEvent(eventName: string, eventData: any = {}, userId?: string) {
  try {
    const response = await fetch('/api/track-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, eventName, eventData }),
    });

    if (!response.ok) {
      throw new Error('Failed to track event');
    }
  } catch (error) {
    console.error('Error tracking event:', error);
    // Silently fail - don't crash the app
  }
}

export async function getEventStats(eventName: string, startDate: Date, endDate: Date) {
  try {
    const response = await fetch('/api/get-event-stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventName, startDate, endDate }),
    });

    if (!response.ok) {
      throw new Error('Failed to get event stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting event stats:', error);
    return { totalEvents: 0, uniqueUsers: 0 };
  }
}