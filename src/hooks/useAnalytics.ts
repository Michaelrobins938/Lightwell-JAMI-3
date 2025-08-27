export const useAnalytics = () => {
  const trackPageView = (page: string) => {
    console.log('Page view tracked:', page);
  };

  const trackFeatureUsage = (feature: string, data?: any) => {
    console.log('Feature usage tracked:', feature, data);
  };

  return {
    trackPageView,
    trackFeatureUsage
  };
};
